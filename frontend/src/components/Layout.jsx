import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Home, BookOpen, CheckCircle2, User, Sparkles, Bot, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { user, updateProfile } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);

    if (user && updateProfile) {
      try {
        await updateProfile({ preferredLanguage: newLang, language: newLang });
      } catch (_) {}
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="top-header">
        <Link to="/dashboard" className="brand-logo">
          <Sparkles size={22} />
          <span>{t('nav.brand', 'STEM Edu')}</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              {t('nav.admin', 'Admin')}
            </Link>
          )}

          {user && (
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--color-primary-light, #EFF6FF)',
                color: 'var(--color-primary, #2563EB)',
                padding: '4px 8px',
                borderRadius: '999px',
                fontWeight: '600'
              }}
            >
              Class {user.classLevel || 10} • {user.board || 'CBSE'}
            </span>
          )}

          {/* Interactive Language Selector (Task P2-1.4) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-border, #E2E8F0)', borderRadius: '6px', padding: '2px 6px', backgroundColor: '#FFFFFF' }}>
            <Globe size={14} color="#64748B" />
            <select
              value={i18n.language ? i18n.language.substring(0, 2) : 'en'}
              onChange={handleLanguageChange}
              aria-label="Language Selector"
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none',
                color: '#1E293B'
              }}
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Mobile-First Bottom Navigation Bar (Updated for Phase 2 with Saarthi AI) */}
      <nav className="bottom-nav" aria-label="Main Navigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <Home size={20} />
          <span>{t('nav.dashboard', 'Home')}</span>
        </NavLink>

        <NavLink
          to="/subjects"
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <BookOpen size={20} />
          <span>{t('nav.subjects', 'Learn')}</span>
        </NavLink>

        <NavLink
          to="/mentor"
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          style={({ isActive }) => ({ color: isActive ? '#7C3AED' : undefined })}
        >
          <Bot size={20} />
          <span>{t('nav.mentor', 'Saarthi')}</span>
        </NavLink>

        <NavLink
          to="/results"
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <CheckCircle2 size={20} />
          <span>Practice</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <User size={20} />
          <span>{t('nav.profile', 'Profile')}</span>
        </NavLink>
      </nav>
    </div>
  );
}
