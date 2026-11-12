import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, Loader2, Calendar, Clock, CheckCircle2, AlertTriangle, Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import api from '../services/api';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [weakData, setWeakData] = useState({ weakTopics: [], topicAccuracy: [], totalTests: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'diagnostics'

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [resultsRes, weakRes] = await Promise.all([
          api.getResults().catch(() => []),
          fetch('/api/weak-topics', {
            headers: {
              ...(localStorage.getItem('token') && { Authorization: `Bearer ${localStorage.getItem('token')}` })
            }
          }).then(r => r.json()).catch(() => ({ weakTopics: [], topicAccuracy: [] }))
        ]);

        setResults(resultsRes || []);
        if (weakRes?.success) {
          setWeakData(weakRes);
        }
      } catch (err) {
        console.error('Failed to load results:', err);
        setError('Failed to fetch test history.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Practice Test & Weak Topics Diagnostics</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Review past scores, identify weak topics, and revise with Saarthi AI
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--color-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('history')}
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem' }}
          >
            Past Attempts ({results.length})
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`btn ${activeTab === 'diagnostics' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <BarChart2 size={15} /> Weak Topics Analysis
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Weak Topics Quick Callout Banner if weak topics detected */}
      {weakData.weakTopics && weakData.weakTopics.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: '20px',
            backgroundColor: '#FEF3C7',
            borderColor: '#F59E0B',
            color: '#92400E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '14px 18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} color="#D97706" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                {weakData.weakTopics.length} Weak Topic{weakData.weakTopics.length > 1 ? 's' : ''} Identified
              </div>
              <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                Topics where your accuracy is below 60%. Saarthi has recorded these to guide your next practice session.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const first = weakData.weakTopics[0];
              const prompt = `I need help revising my weak topic: "${first.topic}" in ${first.subject}. My accuracy was ${first.accuracyPercentage}%. Could you explain the core concepts and test me with a simple question?`;
              navigate('/mentor', { state: { prefill: prompt, subject: first.subject } });
            }}
            className="btn btn-primary"
            style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#D97706', borderColor: '#D97706' }}
          >
            <Sparkles size={15} /> Revise Weak Topics with Saarthi
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0', color: 'var(--color-primary)' }}>
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : activeTab === 'diagnostics' ? (
        /* Diagnostics View: Topic-wise accuracy & Weak topics list (P2-5.4) */
        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="var(--color-primary)" />
              Topic-Wise Accuracy Breakdown
            </h2>

            {weakData.topicAccuracy && weakData.topicAccuracy.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {weakData.topicAccuracy.map((stat, idx) => {
                  const isWeak = stat.accuracyPercentage < 60;
                  const isStrong = stat.accuracyPercentage >= 80;
                  const barColor = isWeak ? 'var(--color-error)' : isStrong ? 'var(--color-success)' : 'var(--color-primary)';

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div>
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>{stat.topic}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginLeft: '8px' }}>({stat.subject})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.9rem', color: barColor }}>
                            {stat.accuracyPercentage}% ({stat.correctCount}/{stat.totalAttempts})
                          </span>
                          {isWeak && (
                            <button
                              onClick={() => {
                                const prompt = `I am struggling with the topic "${stat.topic}" in ${stat.subject}. Can you give me a simple 3-step explanation of the core principles?`;
                                navigate('/mentor', { state: { prefill: prompt, subject: stat.subject } });
                              }}
                              className="btn btn-secondary"
                              style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Sparkles size={13} /> Ask Saarthi
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${stat.accuracyPercentage}%`,
                            height: '100%',
                            backgroundColor: barColor,
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
                Complete chapter practice tests to view your topic-by-topic diagnostic breakdown!
              </p>
            )}
          </div>
        </div>
      ) : results.length > 0 ? (
        /* History View: List past attempts */
        <div style={{ display: 'grid', gap: '12px' }}>
          {results.map((item, idx) => {
            const chapTitle = item.chapterId?.title || 'Chapter Practice Test';
            const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            const isHigh = item.percentage >= 80;

            return (
              <div
                key={item._id || item.id || idx}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 0,
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      backgroundColor: isHigh ? 'var(--color-success-light)' : 'var(--color-primary-light)',
                      color: isHigh ? 'var(--color-success)' : 'var(--color-primary)',
                      padding: '12px',
                      borderRadius: '12px'
                    }}
                  >
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{chapTitle}</h3>
                    <div style={{ display: 'flex', gap: '12px', color: 'var(--color-muted)', fontSize: '0.8rem', marginTop: '3px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {dateStr}
                      </span>
                      {item.timeTakenSeconds > 0 && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {item.timeTakenSeconds}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      fontWeight: '700',
                      fontSize: '0.92rem',
                      color: isHigh ? 'var(--color-success)' : 'var(--color-primary)',
                      backgroundColor: isHigh ? 'var(--color-success-light)' : 'var(--color-primary-light)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      marginBottom: '4px'
                    }}
                  >
                    {item.score} / {item.totalQuestions} ({item.percentage}%)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isHigh ? 'var(--color-success)' : 'var(--color-muted)', fontWeight: '600' }}>
                    {isHigh ? 'Passed' : 'Needs Practice'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '36px 20px',
            color: 'var(--color-muted)'
          }}
        >
          <Award size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>
            No Test Attempts Yet
          </h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '20px' }}>
            Take an MCQ test from any chapter to evaluate your understanding and see your detailed history here!
          </p>
          <Link to="/subjects" className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>
            Browse Subjects to Practice
          </Link>
        </div>
      )}
    </div>
  );
}
