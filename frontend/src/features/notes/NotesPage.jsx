import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Sparkles, FileText, CheckCircle, AlertCircle, PenTool, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import HandwritingGenerator from './HandwritingGenerator';

export default function NotesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('handwriting'); // 'handwriting' | 'notes'
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('physics');
  const [classLevel, setClassLevel] = useState(user?.classLevel || 10);
  const [content, setContent] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  // For transferring a saved note into handwriting studio
  const [handwritingSeed, setHandwritingSeed] = useState({ text: '', title: '' });

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notes', {
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

      const res = await fetch('/api/notes', {
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
        setStatusMsg({ type: 'success', text: 'Notes successfully saved and embedded into your private knowledge base!' });
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
      const res = await fetch(`/api/notes/${noteId}`, {
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

  const handleOpenInHandwriting = (note) => {
    setHandwritingSeed({ text: note.content, title: note.title || note.chapter || 'Handwritten Notes' });
    setActiveTab('handwriting');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px' }}>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenTool size={24} color="#7C3AED" /> Student Notes & Handwriting Studio
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Generate realistic handwritten notebook pages, OCR photographed physical notes, and embed them into Saarthi AI.
          </p>
        </div>

        {/* Tab Controls (P2-6.1, P2-6.3) */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--color-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('handwriting')}
            className={`btn ${activeTab === 'handwriting' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <PenTool size={15} /> ✍️ Handwriting Studio & OCR
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`btn ${activeTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <BookOpen size={15} /> 📚 My Saved Notes ({notes.length})
          </button>
        </div>
      </div>

      {/* View 1: Text-to-Handwriting Studio (P2-6.2, P2-6.3, P2-6.4, P2-6.6) */}
      {activeTab === 'handwriting' && (
        <HandwritingGenerator
          initialText={handwritingSeed.text}
          initialTitle={handwritingSeed.title}
          onSaveNote={() => fetchNotes()}
        />
      )}

      {/* View 2: Saved Notes & RAG Knowledge Base (P2-6.1) */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Upload Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '18px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
                  Note Content (Plain Text or Markdown with Math Formulas)
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type notes, formulas, or copy-paste lecture points..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', lineHeight: '1.5' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={saving || !content.trim()}
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={16} /> {saving ? 'Saving...' : 'Save & Embed in Knowledge Base'}
                </button>
              </div>
            </form>
          </div>

          {/* Notes List */}
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', color: '#1E293B' }}>
              Your Uploaded Notes ({notes.length})
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Loading notes...</div>
            ) : notes.length === 0 ? (
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '30px', textAlign: 'center', color: '#64748B', border: '1px dashed #CBD5E1' }}>
                <FileText size={36} color="#94A3B8" style={{ margin: '0 auto 10px auto' }} />
                <p style={{ margin: 0, fontWeight: '500' }}>No personal notes uploaded yet.</p>
                <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>Upload your formulas and notes above or generate handwritten pages.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {notes.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '14px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0F172A' }}>{n.title || n.chapter}</span>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#EDE9FE', color: '#6D28D9', padding: '2px 8px', borderRadius: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
                          {n.subject}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, whiteSpace: 'pre-wrap', maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {n.content}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenInHandwriting(n)}
                        className="btn btn-secondary"
                        style={{ width: 'auto', padding: '6px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <PenTool size={13} /> Turn into Handwriting
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                        title="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
