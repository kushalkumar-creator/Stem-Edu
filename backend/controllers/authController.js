const { createClient } = require('@supabase/supabase-js');
const { supabaseAdmin } = require('../utils/supabaseAdmin');

function getAnonClient() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

/**
 * Register a new user
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, classLevel, board, language } = req.body;
    const studentClass = req.body.class !== undefined ? req.body.class : classLevel;

    // 1. Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ message: 'Database service not configured' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const assignedRole = role && ['student', 'admin', 'mentor'].includes(role) ? role : 'student';

    // 2. Create user in Supabase Auth
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name.trim(),
        role: assignedRole
      }
    });

    if (authErr) {
      return res.status(400).json({ message: authErr.message });
    }

    const userId = authData.user.id;

    // 3. Upsert into public.profiles
    const profilePayload = {
      id: userId,
      full_name: name.trim(),
      role: assignedRole,
      board: board || 'CBSE',
      class_level: studentClass !== undefined ? Number(studentClass) : 10,
      preferred_language: language === 'hi' ? 'hi' : 'en'
    };

    const { error: profileErr } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload);

    if (profileErr) {
      console.warn('Profile upsert warning:', profileErr.message);
    }

    // 4. Generate user session token
    let token = null;
    const anon = getAnonClient();
    if (anon) {
      const { data: sessionData } = await anon.auth.signInWithPassword({
        email: cleanEmail,
        password
      });
      token = sessionData?.session?.access_token || null;
    }

    const userObj = {
      _id: userId,
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      role: assignedRole,
      classLevel: profilePayload.class_level,
      board: profilePayload.board,
      language: profilePayload.preferred_language
    };

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: userObj
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginEmail = identifier || email;

    if (!loginEmail || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const anon = getAnonClient();
    if (!anon) {
      return res.status(500).json({ message: 'Auth service not initialized. Check Supabase keys.' });
    }

    const cleanEmail = loginEmail.toLowerCase().trim();

    // Sign in using Supabase Auth
    const { data: authData, error: authErr } = await anon.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (authErr || !authData?.user) {
      return res.status(401).json({ message: authErr?.message || 'Invalid credentials: user not found' });
    }

    const user = authData.user;
    const token = authData.session.access_token;

    // Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const userObj = {
      _id: user.id,
      id: user.id,
      email: user.email,
      name: profile?.full_name || user.user_metadata?.full_name || '',
      role: profile?.role || user.user_metadata?.role || 'student',
      board: profile?.board || 'CBSE',
      classLevel: profile?.class_level || 10,
      preferredLanguage: profile?.preferred_language || 'en'
    };

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: userObj
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 * GET /api/me
 */
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current authenticated user profile
 * PUT /api/me
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, role, classLevel, board, language, preferredLanguage, saarthiMemoryEnabled } = req.body;
    const studentClass = req.body.class !== undefined ? req.body.class : classLevel;

    const updates = {};
    if (name !== undefined) updates.full_name = name.trim();
    if (studentClass !== undefined) updates.class_level = Number(studentClass);
    if (board !== undefined) updates.board = board;
    if (preferredLanguage !== undefined) updates.preferred_language = preferredLanguage;
    if (language !== undefined) updates.preferred_language = language;
    if (saarthiMemoryEnabled !== undefined) updates.saarthi_memory_enabled = Boolean(saarthiMemoryEnabled);

    // Only admins can alter role
    if (role !== undefined && req.user.role === 'admin') {
      updates.role = role;
    }

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const userObj = {
      ...req.user,
      name: updatedProfile.full_name || req.user.name,
      role: updatedProfile.role || req.user.role,
      board: updatedProfile.board,
      classLevel: updatedProfile.class_level,
      preferredLanguage: updatedProfile.preferred_language,
      saarthiMemoryEnabled: updatedProfile.saarthi_memory_enabled
    };

    res.status(200).json({
      message: 'Profile updated successfully',
      user: userObj
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile
};
