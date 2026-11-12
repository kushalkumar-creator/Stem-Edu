import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync Supabase Auth session & onAuthStateChange listener
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && mounted) {
          const currentToken = session.access_token;
          setToken(currentToken);
          localStorage.setItem('token', currentToken);

          // Fetch user profile from backend /api/me
          try {
            const res = await api.getMe();
            if (res && res.user && mounted) {
              setUser(res.user);
              localStorage.setItem('user', JSON.stringify(res.user));
            }
          } catch (_) {
            // Keep existing session user if network slow
          }
        } else if (!session && token && mounted) {
          // If token in localStorage but Supabase session empty, verify with backend
          try {
            const res = await api.getMe();
            if (res && res.user && mounted) {
              setUser(res.user);
              localStorage.setItem('user', JSON.stringify(res.user));
            }
          } catch {
            if (mounted) logout();
          }
        }
      } catch (err) {
        console.warn('Auth initialization warning:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        setToken(session.access_token);
        localStorage.setItem('token', session.access_token);
      } else if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    // Authenticate through API endpoint (which signs in via Supabase)
    const data = await api.login(credentials);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Also set Supabase client session if available
      try {
        if (credentials.email && credentials.password) {
          await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });
        }
      } catch (_) {
        // Handled gracefully
      }
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await api.signup(userData);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      try {
        if (userData.email && userData.password) {
          await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password
          });
        }
      } catch (_) {
        // Handled gracefully
      }
    }
    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    const data = await api.updateMe(profileData);
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    updateProfile,
    supabase
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
