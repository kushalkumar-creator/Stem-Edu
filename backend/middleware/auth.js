const { supabaseAdmin } = require('../utils/supabaseAdmin');

/**
 * Supabase Authentication Middleware (SUPABASE_SETUP.md Section 7)
 * Validates JWT via Supabase Auth and loads user profile from public.profiles
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing token', message: 'Authentication token required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database service not initialized. Check SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY' });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token', message: 'Invalid or expired token' });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Attach user and profile for unified access across Phase 1 & Phase 2
    req.user = {
      ...data.user,
      id: data.user.id,
      _id: data.user.id,
      role: profile?.role || data.user.user_metadata?.role || 'student',
      name: profile?.full_name || data.user.user_metadata?.full_name || '',
      email: data.user.email,
      board: profile?.board || 'CBSE',
      classLevel: profile?.class_level || 10,
      preferredLanguage: profile?.preferred_language || 'en'
    };
    req.profile = profile || {
      id: data.user.id,
      role: req.user.role,
      board: req.user.board,
      class_level: req.user.classLevel,
      preferred_language: req.user.preferredLanguage
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Optional Authentication Middleware
 * Populates req.user if valid bearer token is present, else continues as guest
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data?.user) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        req.user = {
          ...data.user,
          id: data.user.id,
          _id: data.user.id,
          role: profile?.role || data.user.user_metadata?.role || 'student',
          name: profile?.full_name || data.user.user_metadata?.full_name || '',
          email: data.user.email,
          board: profile?.board || 'CBSE',
          classLevel: profile?.class_level || 10,
          preferredLanguage: profile?.preferred_language || 'en'
        };
        req.profile = profile;
      }
    }
    next();
  } catch (_) {
    next();
  }
};

/**
 * Hand-written Admin Authorization Middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Admins only', message: 'Authentication required' });
  }

  const role = req.profile?.role || req.user.role;
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admins only', message: 'Access forbidden: Admin privilege required' });
  }

  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin
};
