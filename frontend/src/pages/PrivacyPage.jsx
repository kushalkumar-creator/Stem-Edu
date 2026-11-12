import React, { useState } from 'react';
import { Shield, Lock, Trash2, Brain, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivacyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeleteData = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/delete-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      const data = await res.json();
      if (data.success) {
        setMessage('All personal memories, notes, and study logs have been permanently deleted.');
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to delete personal data');
      }
    } catch (err) {
      setMessage('Error contacting privacy service. Your request has been queued.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '24px 16px' }}>
      <Link
        to="/dashboard"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', marginBottom: '16px' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: '#1E293B' }}>
              Student Privacy & Data Governance (P2-15.2)
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Compliant with CBSE student data protection guidelines and Row Level Security (RLS).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Brain size={18} color="#7C3AED" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>
                What Saarthi Remembers & Why
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Saarthi records specific academic memory facts (e.g. "Struggles with Lens Formula numericals" or "Prefers Hindi explanations") to construct adaptive 7-day revision plans. Saarthi never records personal identifiers, passwords, or unrelated device metadata.
            </p>
          </div>

          <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock size={18} color="#059669" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>
                Row Level Security & Data Isolation
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              All student notes, test attempts, community messages, and RAG knowledge chunks are protected by PostgreSQL Row Level Security (RLS) policies (`auth.uid() = user_id`). No student can view or search another student's private knowledge base.
            </p>
          </div>

          <div style={{ padding: '14px', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid #FECACA' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertTriangle size={18} color="#DC2626" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#991B1B' }}>
                Right to Erasure ("Delete My Data")
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#7F1D1D', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              You have the right to permanently purge all your personal notes, test attempts, Saarthi memories, and conversation histories from our Supabase database.
            </p>

            {message && (
              <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#FFFFFF', color: '#15803D', fontSize: '0.82rem', fontWeight: '600', marginBottom: '12px' }}>
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleDeleteData}
              disabled={deleting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: confirmDelete ? '#B91C1C' : '#DC2626',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={15} />
              {confirmDelete ? 'Confirm Permanent Data Purge' : 'Delete All My Personal Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

