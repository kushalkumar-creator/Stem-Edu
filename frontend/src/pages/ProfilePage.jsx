import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Globe, BookOpen, Check, Shield, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [board, setBoard] = useState(user?.board || 'CBSE');
  const [classLevel, setClassLevel] = useState(user?.classLevel || 10);
  const [language, setLanguage] = useState(user?.preferredLanguage || user?.language || 'en');
  const [saarthiMemory, setSaarthiMemory] = useState(user?.saarthiMemoryEnabled !== false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateProfile({
        board,
        class: Number(classLevel),
        classLevel: Number(classLevel),
        language,
        preferredLanguage: language,
        saarthiMemoryEnabled: saarthiMemory
      });

      // Switch UI language if changed
      i18n.changeLanguage(language);
      localStorage.setItem('i18nextLng', language);

      setMessage('Preferences updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update preferences: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '32px' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '16px' }}>
        {t('settings.title', 'Learning Preferences & Settings')}
      </h1>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card">
        {/* User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '14px', borderRadius: '50%' }}>
            <User size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{user?.name || 'Student'}</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>{user?.email || 'No email registered'}</p>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', backgroundColor: user?.role === 'admin' ? '#FEE2E2' : '#E0E7FF', color: user?.role === 'admin' ? '#DC2626' : '#4338CA', padding: '2px 8px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
              {user?.role || 'student'}
            </span>
          </div>
        </div>

        {/* 1. Educational Board (Task P2-1.3) */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} /> {t('settings.boardLabel', 'Educational Board')}
          </label>
          <div className="pill-group" style={{ display: 'flex', gap: '8px' }}>
            {['CBSE', 'ICSE', 'State Board'].map((b) => (
              <button
                key={b}
                type="button"
                className={`pill-btn ${board === b ? 'active' : ''}`}
                onClick={() => setBoard(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Class Level (Task P2-1.2, P2-1.3) */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} /> {t('settings.classLabel', 'Class Level')}
          </label>
          <div className="pill-group" style={{ display: 'flex', gap: '8px' }}>
            {[10, 12].map((cls) => (
              <button
                key={cls}
                type="button"
                className={`pill-btn ${Number(classLevel) === cls ? 'active' : ''}`}
                onClick={() => setClassLevel(cls)}
                style={{ padding: '8px 18px', fontWeight: '700' }}
              >
                Class {cls} {cls === 10 ? '(Board Exam)' : '(Senior Secondary)'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Preferred Content & UI Language (Task P2-1.4) */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} /> {t('settings.languageLabel', 'Preferred Language')}
          </label>
          <div className="pill-group" style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`pill-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button
              type="button"
              className={`pill-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिंदी (Hindi)
            </button>
            <button
              type="button"
              className={`pill-btn ${language === 'mr' ? 'active' : ''}`}
              onClick={() => setLanguage('mr')}
            >
              मराठी (Marathi)
            </button>
          </div>
        </div>

        {/* 4. Saarthi Memory Toggle (P2-3.1, P2-3.2) */}
        <div className="form-group" style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontWeight: '600' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={18} color="#7C3AED" />
              {t('settings.memoryToggle', 'Enable Saarthi Long-term Memory')}
            </span>
            <input
              type="checkbox"
              checked={saarthiMemory}
              onChange={(e) => setSaarthiMemory(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </label>
          <p style={{ margin: '6px 0 0 26px', fontSize: '0.8rem', color: '#64748B' }}>
            {t('settings.memoryDesc', 'Allows Saarthi AI to remember your weak topics, study goals, and strengths across sessions for personalized guidance.')}
          </p>
        </div>

        {/* 5. Personal Knowledge Base Link (P2-2.7) */}
        <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#FAF5FF', borderRadius: '8px', border: '1px solid #E9D5FF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#6B21A8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} /> My Private Knowledge Base
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7E22CE', marginTop: '2px' }}>
              Upload and manage your personal study notes and formula sheets.
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/notes')}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Manage Notes
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ width: '100%', marginBottom: '12px' }}
        >
          <Check size={16} /> {saving ? 'Saving...' : t('settings.save', 'Save Preferences')}
        </button>

        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ width: '100%', color: '#DC2626', borderColor: '#FCA5A5' }}
        >
          <LogOut size={16} /> {t('nav.logout', 'Log Out')}
        </button>
      </div>
    </div>
  );
}
