import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InteractiveDiagram({ diagramData, diagramId, subjectCode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [diagram, setDiagram] = useState(diagramData || null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(!diagramData && !!(diagramId || subjectCode));
  const [error, setError] = useState('');

  // Mode: 'explore' | 'quiz' (P2-7.1, P2-7.6)
  const [mode, setMode] = useState('explore');
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState({}); // { [elemId]: guessedCorrectly }
  const [activeQuizQuestion, setActiveQuizQuestion] = useState(null);

  // Zoom scale
  const [zoom, setZoom] = useState(1);

  const isHindi = user?.language === 'hi';

  useEffect(() => {
    if (diagramData) {
      setDiagram(diagramData);
      return;
    }

    const idToFetch = diagramId || subjectCode;
    if (!idToFetch) return;

    async function fetchDiagram() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getDiagramById(idToFetch);
        setDiagram(data);
      } catch (err) {
        console.error('Failed to load diagram:', err);
        setError('Interactive diagram could not be loaded.');
      } finally {
        setLoading(false);
      }
    }

    fetchDiagram();
  }, [diagramData, diagramId, subjectCode]);

  const handleElementTap = (element) => {
    if (mode === 'quiz') {
      // In quiz mode, prompt student to identify the part
      setActiveQuizQuestion(element);
      return;
    }

    if (selectedElement && selectedElement.id === element.id) {
      setSelectedElement(null);
    } else {
      setSelectedElement(element);
    }
  };

  const handleQuizAnswer = (targetElement, guessedLabel) => {
    const isCorrect = targetElement.label === guessedLabel;
    setQuizAnswered(prev => ({
      ...prev,
      [targetElement.id]: isCorrect
    }));
    if (isCorrect) {
      setQuizScore(s => s + 1);
    }
  };

  const handleResetQuiz = () => {
    setQuizScore(0);
    setQuizAnswered({});
    setActiveQuizQuestion(null);
  };

  const handleAskSaarthi = (element) => {
    const prompt = `I am studying the "${diagram.title}" diagram in ${diagram.subjectCode || 'Science'}. Specifically, can you explain the function of the "${element.label}" and how it interacts with the rest of the system?`;
    navigate('/mentor', { state: { prefill: prompt, subject: diagram.subjectCode || 'Science' } });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '30px', color: 'var(--color-primary)' }}>
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (error || !diagram) {
    return null;
  }

  const title = isHindi && diagram.titleHindi ? diagram.titleHindi : diagram.title;
  const elements = diagram.elements || [];

  return (
    <div
      className="card"
      style={{
        margin: '16px 0',
        padding: '16px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden'
      }}
    >
      {/* Diagram Header & Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '6px', borderRadius: '8px' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{title}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              {mode === 'quiz'
                ? `Quiz Mode: Score ${quizScore} / ${elements.length}`
                : (isHindi ? 'किसी भी भाग पर टैप करके सीखें' : 'Tap any labelled part to explore')}
            </span>
          </div>
        </div>

        {/* Action Buttons: Zoom & Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Zoom controls */}
          <button
            onClick={() => setZoom(z => Math.max(0.8, Number((z - 0.2).toFixed(1))))}
            className="btn btn-secondary"
            style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="btn btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px' }}
            title="Reset Zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setZoom(z => Math.min(2.0, Number((z + 0.2).toFixed(1))))}
            className="btn btn-secondary"
            style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>

          {/* Mode Switch (Explore vs Quiz) */}
          <button
            onClick={() => {
              if (mode === 'explore') {
                setMode('quiz');
                handleResetQuiz();
              } else {
                setMode('explore');
                setActiveQuizQuestion(null);
              }
            }}
            className={`btn ${mode === 'quiz' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '4px 10px', fontSize: '0.78rem' }}
          >
            {mode === 'quiz' ? '✓ Quiz Mode' : '🎮 Test Knowledge (Quiz)'}
          </button>

          {selectedElement && mode === 'explore' && (
            <button
              onClick={() => setSelectedElement(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          touchAction: 'manipulation',
          position: 'relative'
        }}
      >
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease', width: '100%' }}>
          <svg
            viewBox={diagram.svgViewBox || '0 0 600 400'}
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '360px' }}
          >
            {/* Physics circuit guide wire if physics circuit */}
            {diagram.title.toLowerCase().includes('circuit') && (
              <path
                d="M 100 190 L 100 60 L 500 60 L 500 190 M 500 190 L 500 330 L 100 330 L 100 190"
                fill="none"
                stroke="#334155"
                strokeWidth="4"
                strokeDasharray="8 4"
              />
            )}

            {elements.map((elem, idx) => {
              const isSelected = selectedElement && selectedElement.id === elem.id;
              const isQuizTarget = activeQuizQuestion && activeQuizQuestion.id === elem.id;
              const isAnswered = quizAnswered[elem.id] !== undefined;
              const answeredCorrect = quizAnswered[elem.id] === true;

              const attrs = elem.attributes || {};

              const shapeProps = {
                key: elem.id,
                onClick: () => handleElementTap(elem),
                onTouchStart: () => handleElementTap(elem),
                style: {
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  filter: isSelected || isQuizTarget ? 'drop-shadow(0 0 8px rgba(37,99,235,0.6))' : 'none'
                }
              };

              let strokeColor = isSelected ? '#2563EB' : (attrs.stroke || '#475569');
              let fillColor = isSelected ? '#DBEAFE' : (attrs.fill || '#EFF6FF');
              let strokeWidth = isSelected ? (Number(attrs.strokeWidth || 3) + 3) : (attrs.strokeWidth || 3);

              if (mode === 'quiz' && isAnswered) {
                strokeColor = answeredCorrect ? '#16A34A' : '#DC2626';
                fillColor = answeredCorrect ? '#DCFCE7' : '#FEE2E2';
              }

              // Display label or Quiz Mask (Part 1, Part 2...)
              let displayText = isHindi && elem.labelHindi ? elem.labelHindi : elem.label;
              if (mode === 'quiz' && !isAnswered) {
                displayText = `? Part ${idx + 1}`;
              }

              if (elem.shape === 'rect') {
                return (
                  <g key={elem.id} {...shapeProps}>
                    <rect
                      x={attrs.x || 0}
                      y={attrs.y || 0}
                      width={attrs.width || 80}
                      height={attrs.height || 40}
                      rx={attrs.rx || 6}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                    <text
                      x={Number(attrs.x || 0) + Number(attrs.width || 80) / 2}
                      y={Number(attrs.y || 0) + Number(attrs.height || 40) / 2 + 5}
                      textAnchor="middle"
                      fill="#0F172A"
                      fontSize="11"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {displayText}
                    </text>
                  </g>
                );
              }

              if (elem.shape === 'circle') {
                return (
                  <g key={elem.id} {...shapeProps}>
                    <circle
                      cx={attrs.cx || 50}
                      cy={attrs.cy || 50}
                      r={attrs.r || 30}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                    <text
                      x={attrs.cx || 50}
                      y={Number(attrs.cy || 50) + 4}
                      textAnchor="middle"
                      fill="#0F172A"
                      fontSize="11"
                      fontWeight="700"
                      pointerEvents="none"
                    >
                      {displayText}
                    </text>
                  </g>
                );
              }

              return null;
            })}
          </svg>
        </div>
      </div>

      {/* Quiz Modal / Question Prompt (P2-7.6) */}
      {mode === 'quiz' && activeQuizQuestion && (
        <div
          style={{
            marginTop: '12px',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#EFF6FF',
            border: '2px solid #3B82F6'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E40AF' }}>
              Identify This Highlighted Component:
            </span>
            <button onClick={() => setActiveQuizQuestion(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
            {elements.map((optionElem) => {
              const isAlreadyCorrect = quizAnswered[activeQuizQuestion.id] === true;
              return (
                <button
                  key={optionElem.id}
                  onClick={() => handleQuizAnswer(activeQuizQuestion, optionElem.label)}
                  disabled={isAlreadyCorrect}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    backgroundColor: 'white'
                  }}
                >
                  {optionElem.label}
                </button>
              );
            })}
          </div>

          {quizAnswered[activeQuizQuestion.id] !== undefined && (
            <div style={{ marginTop: '8px', fontWeight: '700', fontSize: '0.85rem', color: quizAnswered[activeQuizQuestion.id] ? '#15803D' : '#DC2626' }}>
              {quizAnswered[activeQuizQuestion.id] ? '✓ Correct! Well done.' : `✗ Incorrect. This is the "${activeQuizQuestion.label}".`}
            </div>
          )}
        </div>
      )}

      {/* Explanation Drawer Panel (Explore Mode) */}
      {mode === 'explore' && selectedElement ? (
        <div
          style={{
            marginTop: '14px',
            padding: '14px 16px',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '4px solid var(--color-primary)',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--color-primary)' }}>
              {isHindi && selectedElement.labelHindi ? selectedElement.labelHindi : selectedElement.label}
            </h4>
            <button
              onClick={() => handleAskSaarthi(selectedElement)}
              className="btn btn-secondary"
              style={{
                width: 'auto',
                padding: '4px 10px',
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'white'
              }}
            >
              <Sparkles size={13} color="var(--color-primary)" /> Ask Saarthi
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--color-text)', margin: 0 }}>
            {isHindi && selectedElement.explanationHindi ? selectedElement.explanationHindi : selectedElement.explanation}
          </p>
        </div>
      ) : mode === 'explore' ? (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            color: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Info size={16} />
          <span>{isHindi ? 'जानकारी देखने के लिए ऊपर दिए गए किसी भी घटक पर क्लिक करें।' : 'Tap any component in the diagram above to read its function and explanation.'}</span>
        </div>
      ) : null}
    </div>
  );
}
