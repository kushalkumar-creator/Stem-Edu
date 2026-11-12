import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, BookOpen, Loader2 } from 'lucide-react';
import api from '../services/api';
import InteractiveDiagram from '../components/InteractiveDiagram';

export default function DiagramsExplorerPage() {
  const [diagrams, setDiagrams] = useState([]);
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllDiagrams() {
      try {
        setLoading(true);
        const data = await api.getDiagrams();
        setDiagrams(data || []);
        if (data && data.length > 0) {
          setSelectedDiagram(data[0]);
        }
      } catch (err) {
        console.error('Failed to load diagrams list:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllDiagrams();
  }, []);

  const filtered = selectedSubject === 'all'
    ? diagrams
    : diagrams.filter(d => (d.subjectCode || '').toLowerCase() === selectedSubject.toLowerCase());

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={24} color="var(--color-primary)" /> Interactive STEM Diagrams
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', margin: '4px 0 0 0' }}>
          Explore anatomical structures, electric circuits, chemical apparatus, and geometric constructions. Tap parts to learn or test your knowledge in Quiz mode.
        </p>
      </div>

      {/* Subject Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['all', 'biology', 'physics', 'chemistry', 'mathematics'].map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`btn ${selectedSubject === subj ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '6px 14px', fontSize: '0.82rem', textTransform: 'capitalize' }}
          >
            {subj === 'all' ? 'All Diagrams' : subj}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0', color: 'var(--color-primary)' }}>
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(360px, 2fr)', gap: '20px', alignItems: 'start' }}>
          {/* Diagrams list */}
          <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Select Diagram ({filtered.length})
            </h2>

            {filtered.map((d) => {
              const isSelected = selectedDiagram?.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDiagram(d)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <span style={{ fontWeight: '700', fontSize: '0.92rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {d.title}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: 'var(--color-muted)' }}>
                      {d.subjectCode}
                    </span>
                    <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--color-border)', padding: '1px 6px', borderRadius: '4px' }}>
                      {d.elements?.length || 0} parts
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Interactive Diagram */}
          <div>
            {selectedDiagram ? (
              <InteractiveDiagram diagramData={selectedDiagram} />
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                Select a diagram from the list to begin exploring.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

