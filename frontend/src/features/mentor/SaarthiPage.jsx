import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, BookOpen, Clock, Brain, Trash2, ArrowRight, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function SaarthiPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [mode, setMode] = useState('doubt'); // 'doubt' | 'mentor'
  const [subject, setSubject] = useState('physics');
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'init_1',
      role: 'assistant',
      content: `Namaste ${user?.name || 'Student'}! I am **Saarthi**, your CBSE Class ${user?.classLevel || 10} STEM mentor and doubt solver.\n\nYou can ask me any doubt in Physics, Chemistry, Biology, or Mathematics, and I will explain step-by-step from official CBSE textbooks in your language!`,
      sources: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchMemories = async () => {
    try {
      setLoadingMemories(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/mentor/memories', {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      const data = await res.json();
      if (data.success) {
        setMemories(data.data || []);
      }
    } catch (err) {
      console.error('Fetch memories error:', err);
    } finally {
      setLoadingMemories(false);
    }
  };

  const deleteMemory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/mentor/memories/${id}`, {
        method: 'DELETE',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Delete memory error:', err);
    }
  };

  const handleOpenMemoryModal = () => {
    setShowMemoryModal(true);
    fetchMemories();
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    setInputText('');
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: query
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: query,
          mode,
          subject,
          board: user?.board || 'CBSE',
          classLevel: user?.classLevel || 10,
          language: user?.preferredLanguage || user?.language || 'en'
        })
      });

      if (!response.ok) {
        throw new Error('Saarthi service returned error');
      }

      const data = await response.json();
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.content || data.message?.content,
        sources: data.sources || []
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Graceful client fallback response
      const fallbackReply = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mode === 'doubt'
          ? `### Saarthi Guided Solution (CBSE Class ${user?.classLevel || 10})\n\n**Concept Breakdown for "${query}":**\n\n1. **Core Principle:** In CBSE ${subject.toUpperCase()}, always begin by identifying the known quantities, unknown variables, and standard formulas.\n2. **Step-by-Step Method:** Substitute values systematically with appropriate SI units.\n3. **Board Exam Strategy:** Box your final answer with units for full marks.`
          : `### Saarthi Revision Guidance (CBSE Class ${user?.classLevel || 10})\n\nHere is your targeted study strategy for **${subject.toUpperCase()}**:\n\n- **Focus Area:** Review standard derivations and textbook exemplar problems.\n- **Daily Goal:** Complete 1 chapter test and write down all core formulas on your formula sheet.\n- **Tip:** Active recall and self-testing produce 2x better retention than passive reading!`,
        sources: [
          { chapter: subject === 'physics' ? 'Electricity' : 'Curriculum Standard', source: 'NCERT CBSE Core Model' }
        ]
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = mode === 'doubt'
    ? [
        "Explain Ohm's Law with formula and circuit diagram",
        "How do stomata open and close in plants?",
        "What is the Fundamental Theorem of Arithmetic?",
        "Explain Raoult's law for solutions"
      ]
    : [
        "What should I study today for CBSE Class 10?",
        "Show my weak topics and give a revision plan",
        "Give me a 30-minute revision plan for Science",
        "How should I prepare for board exam numericals?"
      ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: '780px', margin: '0 auto', padding: '0 8px' }}>
      {/* Top Header Card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#7C3AED', color: '#FFFFFF', padding: '8px', borderRadius: '10px' }}>
            <Bot size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Saarthi AI <Sparkles size={16} color="#EAB308" />
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
              CBSE Class {user?.classLevel || 10} • {user?.board || 'CBSE'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Memory Modal Button */}
          <button
            type="button"
            onClick={handleOpenMemoryModal}
            title="What Saarthi remembers about you"
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Brain size={15} color="#7C3AED" /> Memory
          </button>

          {/* Doubt vs Mentor Mode Toggle */}
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '2px' }}>
            <button
              type="button"
              onClick={() => setMode('doubt')}
              style={{
                padding: '5px 10px',
                fontSize: '0.75rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === 'doubt' ? '#7C3AED' : 'transparent',
                color: mode === 'doubt' ? '#FFFFFF' : '#64748B'
              }}
            >
              Doubt
            </button>
            <button
              type="button"
              onClick={() => setMode('mentor')}
              style={{
                padding: '5px 10px',
                fontSize: '0.75rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === 'mentor' ? '#2563EB' : 'transparent',
                color: mode === 'mentor' ? '#FFFFFF' : '#64748B'
              }}
            >
              Mentor
            </button>
          </div>
        </div>
      </div>

      {/* Subject Selector Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', padding: '2px 4px 8px 4px' }}>
        {[
          { code: 'physics', label: 'Physics' },
          { code: 'chemistry', label: 'Chemistry' },
          { code: 'biology', label: 'Biology' },
          { code: 'mathematics', label: 'Maths' }
        ].map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => setSubject(s.code)}
            style={{
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '999px',
              border: subject === s.code ? '1px solid #7C3AED' : '1px solid #E2E8F0',
              backgroundColor: subject === s.code ? '#EDE9FE' : '#FFFFFF',
              color: subject === s.code ? '#6D28D9' : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {s.label}
          </button>
        ))}

        <Link
          to="/notes"
          style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#7C3AED',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            padding: '4px 8px'
          }}
        >
          <BookOpen size={14} /> My Notes
        </Link>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div
              style={{
                backgroundColor: m.role === 'user' ? '#7C3AED' : '#FFFFFF',
                color: m.role === 'user' ? '#FFFFFF' : '#1E293B',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomRightRadius: m.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '16px',
                border: m.role === 'assistant' ? '1px solid #E2E8F0' : 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}
            >
              {m.content}
            </div>

            {/* Citations & Sources */}
            {m.sources && m.sources.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                {m.sources.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <BookOpen size={12} /> {s.source || 'NCERT'} • Ch {s.chapter}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '10px 16px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.85rem' }}>
            <Sparkles size={16} className="animate-spin" color="#7C3AED" /> Saarthi is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Pills */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '6px 4px', marginBottom: '8px' }}>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(p)}
            style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: 'flex', gap: '8px', padding: '6px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--color-border)' }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={mode === 'doubt' ? `Ask any ${subject.toUpperCase()} doubt...` : "Ask for study guidance, weak areas, or revision plans..."}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontSize: '0.9rem' }}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          style={{
            backgroundColor: '#7C3AED',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !inputText.trim() || loading ? 0.6 : 1
          }}
        >
          <Send size={16} />
        </button>
      </form>

      {/* Memory Modal (P2-3.6) */}
      {showMemoryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={20} color="#7C3AED" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>What Saarthi Remembers About Me</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMemoryModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#64748B' }}>
                Saarthi automatically remembers your weak topics, study goals, and strengths to personalize revision plans. You can delete any fact anytime.
              </p>

              {loadingMemories ? (
                <div style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>Loading memory...</div>
              ) : memories.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                  No memories recorded yet. As you ask questions and solve tests, Saarthi will remember your key weak areas!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {memories.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: m.type === 'weakness' ? '#FEE2E2' : '#E0E7FF',
                            color: m.type === 'weakness' ? '#991B1B' : '#3730A3',
                            marginRight: '6px'
                          }}
                        >
                          {m.type}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: '500' }}>{m.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteMemory(m.id)}
                        title="Delete memory"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444', padding: '4px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
