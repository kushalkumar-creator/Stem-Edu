import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Bot, Sparkles, HelpCircle, Award, Check, X } from 'lucide-react';
import RayOpticsSimulation from './RayOpticsSimulation';
import MoleculeViewerSimulation from './MoleculeViewerSimulation';
import ConicSectionsSimulation from './ConicSectionsSimulation';
import HeartCirculationSimulation from './HeartCirculationSimulation';
import WavesSoundSimulation from './WavesSoundSimulation';
import TrigUnitCircleSimulation from './TrigUnitCircleSimulation';
import NewtonLawsSimulation from './NewtonLawsSimulation';
import BreathingRespirationSimulation from './BreathingRespirationSimulation';
import SkeletonMusclesSimulation from './SkeletonMusclesSimulation';

export default function TopicViewerPage() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'notes' | 'quiz'

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/virtual/${topicSlug}`);
        const data = await res.json();
        if (data.success) {
          setTopic(data.data);
        }
      } catch (err) {
        console.error('Fetch topic error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicSlug]);

  const handleSelectAnswer = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = async () => {
    if (!topic?.quiz) return;
    let correctCount = 0;
    topic.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / topic.quiz.length) * 100);
    setScore(finalScore);
    setQuizSubmitted(true);

    // Record progress to backend
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/virtual/${topicSlug}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ score: finalScore, completed: true })
      });
    } catch (_) {}
  };

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>Loading 3D simulation...</div>;
  }

  if (!topic) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h2>Topic not found</h2>
        <Link to="/virtual-learning" className="btn btn-primary" style={{ marginTop: '12px' }}>
          Back to Virtual Learning
        </Link>
      </div>
    );
  }

  // Render proper simulation based on slug
  const renderSimulation = () => {
    switch (topicSlug) {
      case 'light-and-optics':
        return <RayOpticsSimulation />;
      case 'molecule-viewer':
        return <MoleculeViewerSimulation />;
      case 'conic-sections':
        return <ConicSectionsSimulation />;
      case 'heart-and-circulation':
        return <HeartCirculationSimulation />;
      case 'waves-and-sound':
        return <WavesSoundSimulation />;
      case 'trigonometry-unit-circle':
        return <TrigUnitCircleSimulation />;
      case 'newtons-laws':
        return <NewtonLawsSimulation />;
      case 'breathing-and-respiration':
        return <BreathingRespirationSimulation />;
      case 'skeleton-and-muscles':
        return <SkeletonMusclesSimulation />;
      default:
        return <RayOpticsSimulation />;
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '16px' }}>
      {/* Header & Back Link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <Link
          to="/virtual-learning"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}
        >
          <ArrowLeft size={16} /> Back to Simulations
        </Link>

        {/* Ask Saarthi Button */}
        <button
          type="button"
          onClick={() => navigate('/mentor')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#EDE9FE',
            color: '#6D28D9',
            border: '1px solid #C4B5FD',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Bot size={15} /> Ask Saarthi about this
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px' }}>
            {topic.subject} • Class {topic.class_level}
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>
            CBSE 3D Lab
          </span>
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: '#1E293B' }}>{topic.title}</h1>
        <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '4px 0 0 0' }}>{topic.description}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '16px' }}>
        {[
          { id: 'simulation', label: 'Interactive 3D Simulation' },
          { id: 'notes', label: 'CBSE Notes & Formulas' },
          { id: 'quiz', label: `Self-Check Quiz (${topic.quiz?.length || 3})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: '700',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #2563EB' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? '#1D4ED8' : '#64748B',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Simulation */}
      {activeTab === 'simulation' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {renderSimulation()}
        </div>
      )}

      {/* Tab 2: Notes & Formulas */}
      {activeTab === 'notes' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.9rem', lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-line' }}>
          {topic.notes}
        </div>
      )}

      {/* Tab 3: Quiz Mode */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quizSubmitted && (
            <div style={{ backgroundColor: '#ECFDF5', padding: '16px', borderRadius: '12px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={28} color="#059669" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#065F46' }}>Quiz Completed!</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#047857' }}>You scored {score}% in this topic diagnostic.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                }}
                style={{ padding: '6px 12px', backgroundColor: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Retake Quiz
              </button>
            </div>
          )}

          {(topic.quiz || []).map((q, qIdx) => {
            const isAnswered = selectedAnswers[qIdx] !== undefined;
            const isCorrect = selectedAnswers[qIdx] === q.correctIndex;

            return (
              <div key={qIdx} style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                  {qIdx + 1}. {q.question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    let optBg = '#F8FAFC';
                    let optBorder = '#E2E8F0';

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        optBg = '#ECFDF5';
                        optBorder = '#10B981';
                      } else if (isSelected) {
                        optBg = '#FEF2F2';
                        optBorder = '#EF4444';
                      }
                    } else if (isSelected) {
                      optBg = '#EFF6FF';
                      optBorder = '#2563EB';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(qIdx, optIdx)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: `1px solid ${optBorder}`,
                          backgroundColor: optBg,
                          fontSize: '0.85rem',
                          color: '#334155',
                          cursor: quizSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && optIdx === q.correctIndex && <Check size={16} color="#059669" />}
                        {quizSubmitted && isSelected && !isCorrect && <X size={16} color="#DC2626" />}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '0.78rem', color: '#475569', borderLeft: '3px solid #2563EB' }}>
                    💡 <strong>CBSE Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!quizSubmitted && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleQuizSubmit}
                disabled={Object.keys(selectedAnswers).length === 0}
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  opacity: Object.keys(selectedAnswers).length === 0 ? 0.6 : 1
                }}
              >
                Submit Answers
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

