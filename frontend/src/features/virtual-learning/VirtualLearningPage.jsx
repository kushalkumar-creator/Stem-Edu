import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Box, Compass, CheckCircle2, ArrowRight, Search, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function VirtualLearningPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('/api/virtual', {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });
        const data = await res.json();
        if (data.success) {
          setTopics(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch virtual topics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((t) => {
    const matchSubj = selectedSubject === 'all' || t.subject === selectedSubject;
    const matchClass = selectedClass === 'all' || t.class_level === Number(selectedClass);
    const matchSearch = !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubj && matchClass && matchSearch;
  });

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#FFFFFF',
          marginBottom: '24px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '10px' }}>
          <Sparkles size={14} color="#FDE047" /> CBSE Interactive 3D Suite
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 8px 0' }}>Virtual Learning & 3D Simulations</h1>
        <p style={{ fontSize: '0.9rem', color: '#E0E7FF', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
          Manipulate ray optics, rotate 3D covalent molecules, slice conic sections, and follow double blood circulation in real-time.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
        {/* Subject Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'all', label: 'All Subjects' },
            { id: 'physics', label: 'Physics' },
            { id: 'chemistry', label: 'Chemistry' },
            { id: 'biology', label: 'Biology' },
            { id: 'mathematics', label: 'Maths' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSubject(s.id)}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '999px',
                border: selectedSubject === s.id ? '1px solid #4338CA' : '1px solid #CBD5E1',
                backgroundColor: selectedSubject === s.id ? '#EEF2FF' : '#FFFFFF',
                color: selectedSubject === s.id ? '#4338CA' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Class Filter & Search */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', backgroundColor: '#FFFFFF', fontWeight: '600' }}
          >
            <option value="all">All Classes</option>
            <option value="10">Class 10</option>
            <option value="12">Class 12</option>
          </select>

          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search simulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '6px 12px 6px 32px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem', outline: 'none', width: '160px' }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Simulation Cards */}
      {loading ? (
        <div style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>Loading interactive 3D simulations...</div>
      ) : filteredTopics.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1', color: '#64748B' }}>
          <Compass size={32} style={{ margin: '0 auto 8px auto', color: '#94A3B8' }} />
          <p style={{ margin: 0, fontWeight: '600' }}>No simulations match your filter criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
          {filteredTopics.map((t) => (
            <div
              key={t.slug}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#EEF2FF',
                      color: '#4338CA'
                    }}
                  >
                    {t.subject} • Class {t.class_level}
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: '700', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                    <Box size={12} /> 3D Lab
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0 0 6px 0', color: '#1E293B' }}>{t.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>{t.description}</p>
              </div>

              <div style={{ padding: '12px 18px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: t.completed ? '#059669' : '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t.completed ? <CheckCircle2 size={15} /> : null}
                  {t.completed ? `Score: ${t.score}%` : 'Ready to explore'}
                </span>

                <Link
                  to={`/virtual-learning/${t.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#4338CA',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  <Play size={13} fill="#FFFFFF" /> Launch 3D
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

