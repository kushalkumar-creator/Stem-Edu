import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  Send,
  Sparkles,
  Shield,
  ExternalLink,
  Hash,
  Bot,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CommunityPage() {
  const { user } = useAuth();

  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState('general-chat');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // Load channels
  useEffect(() => {
    async function loadChannels() {
      try {
        const res = await fetch('/api/community/channels');
        const data = await res.json();
        if (data.success && data.channels) {
          setChannels(data.channels);
        }
      } catch (err) {
        console.error('Failed to load channels:', err);
      }
    }
    loadChannels();
  }, []);

  // Load channel messages
  const fetchMessages = async (slug) => {
    try {
      const res = await fetch(`/api/community/channels/${slug}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages(activeChannel);
    const interval = setInterval(() => fetchMessages(activeChannel), 3000);
    return () => clearInterval(interval);
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/community/channels/${activeChannel}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ content: inputText })
      });

      const data = await res.json();
      if (data.success) {
        setInputText('');
        fetchMessages(activeChannel);
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  const currentChannelObj = channels.find(c => c.slug === activeChannel) || { name: 'Discussion Room' };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={24} color="#7C3AED" /> Peer Study Community & Discord Hub
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', margin: '4px 0 0 0' }}>
            Collaborate with Class 10 & 12 peers, discuss doubts in subject rooms, or tag @saarthi for instant Socratic help!
          </p>
        </div>

        {/* Discord Join Pill */}
        <a
          href="https://discord.gg/stem-edu-cbse"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            width: 'auto',
            padding: '8px 16px',
            fontSize: '0.85rem',
            backgroundColor: '#5865F2',
            borderColor: '#5865F2',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none'
          }}
        >
          <ExternalLink size={16} /> Join StemEdu Discord Server (2.4k Students)
        </a>
      </div>

      {/* Main Grid: Channels Sidebar vs Chat Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) minmax(360px, 2.5fr)', gap: '16px', alignItems: 'start' }}>
        {/* Left Sidebar: Channels & Guidelines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Channel list */}
          <div className="card" style={{ padding: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Study Rooms
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
              {channels.map((ch) => (
                <button
                  key={ch.slug}
                  onClick={() => setActiveChannel(ch.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: activeChannel === ch.slug ? 'var(--color-primary-light)' : 'transparent',
                    color: activeChannel === ch.slug ? 'var(--color-primary)' : 'var(--color-text)',
                    fontWeight: activeChannel === ch.slug ? '700' : '500',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Hash size={16} color={activeChannel === ch.slug ? 'var(--color-primary)' : '#94A3B8'} />
                  <span>{ch.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guidelines & Safety (P2-11.2) */}
          <div className="card" style={{ padding: '14px', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#1E293B', marginBottom: '8px' }}>
              <Shield size={16} color="#059669" />
              Community Safety Rules
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.78rem', color: '#64748B', lineHeight: '1.5' }}>
              <li>Be encouraging and respectful to fellow students.</li>
              <li>Never share phone numbers, addresses, or private info.</li>
              <li>Tag <strong>@saarthi</strong> anytime to invite AI mentor tips into the chat.</li>
              <li>No exam cheating or unauthorized paper leaks.</li>
            </ul>
          </div>
        </div>

        {/* Right Area: Chat Message Stream */}
        <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '580px', overflow: 'hidden' }}>
          {/* Channel Header */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Hash size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.98rem' }}>{currentChannelObj.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{currentChannelObj.description}</div>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, idx) => {
              const isSaarthi = m.is_bot;
              return (
                <div
                  key={m.id || idx}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    backgroundColor: isSaarthi ? '#EDE9FE' : 'transparent',
                    padding: isSaarthi ? '10px 12px' : '4px 0',
                    borderRadius: isSaarthi ? '8px' : '0',
                    borderLeft: isSaarthi ? '3px solid #7C3AED' : 'none'
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isSaarthi ? '#7C3AED' : '#2563EB',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}
                  >
                    {isSaarthi ? <Bot size={18} /> : (m.user_name || 'S')[0].toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: isSaarthi ? '#6D28D9' : '#0F172A' }}>
                        {m.user_name}
                      </span>
                      {isSaarthi && (
                        <span style={{ fontSize: '0.68rem', backgroundColor: '#7C3AED', color: 'white', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          BOT
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.4' }}>
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              backgroundColor: 'white'
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${currentChannelObj.name} (type @saarthi for AI hints)...`}
              className="input"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.88rem' }}
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="btn btn-primary"
              style={{ width: 'auto', padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
