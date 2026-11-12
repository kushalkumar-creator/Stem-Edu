import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Sparkles, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function NotesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('physics');
  const [classLevel, setClassLevel] = useState(user?.classLevel || 10);
  const [content, setContent] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/rag/notes', {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      const data = await res.json();
      if (data.success) {
        setNotes(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!content.trim() || saving) return;

    try {
      setSaving(true);
      setStatusMsg(null);
      const token = localStorage.getItem('token');

      const res = await fetch('/api/rag/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          title: title.trim() || 'My Notes',
          subject,
          classLevel: Number(classLevel),
          board: user?.board || 'CBSE',
          content: content.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Notes successfully chunked and embedded into your private knowledge base!' });
        setTitle('');
        setContent('');
        fetchNotes();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to save notes.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error saving notes.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note from your personal knowledge base?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/rag/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      const data = await res.json();
      if (data.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={24} color="#7C3AED" /> My Knowledge Base
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Upload personal revision notes. Saarthi AI automatically incorporates these private notes when answering your doubts.
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '18px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} color="#2563EB" /> Add Study Notes or Formulas
        </h2>

        {statusMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
              backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
              border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`
            }}
          >
            {statusMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Note Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Formulas for Ray Optics"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="mathematics">Mathematics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Class Level
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
              >
                <option value={10}>Class 10</option>
                <option value={12}>Class 12</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              Note Content / Excerpt
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste lecture notes, formula derivations, teacher tips, or revision summaries here..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit' }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving || !content.trim()}
              style={{
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: saving || !content.trim() ? 0.6 : 1
              }}
            >
              {saving ? <Sparkles size={16} className="animate-spin" /> : <Plus size={16} />}
              {saving ? 'Chunking & Embedding...' : 'Save to Private Knowledge Base'}
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Notes List */}
      <div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>
          Saved Notes ({notes.length})
        </h2>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>Loading notes...</div>
        ) : notes.length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px dashed #CBD5E1',
              color: '#64748B'
            }}
          >
            <FileText size={32} style={{ margin: '0 auto 8px auto', color: '#94A3B8' }} />
            <p style={{ margin: 0, fontWeight: '600' }}>No personal notes added yet.</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>Add your study notes above to train your private Saarthi AI assistant!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {notes.map((n) => (
              <div
                key={n.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#EDE9FE',
                        color: '#6D28D9'
                      }}
                    >
                      {n.subject} • Class {n.class_level}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(n.id)}
                      title="Delete note"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444', padding: '2px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 6px 0', color: '#1E293B' }}>
                    {n.chapter || 'Study Note'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5, maxHeight: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {n.content}
                  </p>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #F1F5F9', fontSize: '0.72rem', color: '#94A3B8' }}>
                  Added {new Date(n.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
