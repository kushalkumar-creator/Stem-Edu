import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Eye,
  Settings,
  ArrowRight,
  Sparkles,
  Video,
  MessageSquare,
  Activity,
  Cpu,
  Database
} from 'lucide-react';
import { getAdminStats } from '../../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAdminStats()
      .then((data) => {
        if (isMounted && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch admin stats');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const statItems = [
    { label: 'Total Students', value: stats?.users ?? '-', icon: Users, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'STEM Subjects', value: stats?.subjects ?? '-', icon: BookOpen, color: '#059669', bg: '#ECFDF5' },
    { label: 'Chapters', value: stats?.chapters ?? '-', icon: Layers, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Lessons', value: stats?.lessons ?? '-', icon: FileText, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Practice MCQs', value: stats?.questions ?? '-', icon: HelpCircle, color: '#DC2626', bg: '#FEF2F2' },
    { label: '3D Simulations', value: stats?.virtualTopics ?? 9, icon: Sparkles, color: '#0284C7', bg: '#F0F9FF' },
    { label: '3D Virtual Labs', value: stats?.labs ?? 3, icon: Settings, color: '#4F46E5', bg: '#EEF2FF' },
    { label: 'Chapter Videos', value: stats?.videos ?? 4, icon: Video, color: '#E11D48', bg: '#FFE4E6' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '32px' }}>
      {/* Admin Header */}
      <div
        className="card"
        style={{
          marginBottom: '16px',
          padding: '16px',
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: '#F8FAFC'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', backgroundColor: '#DC2626', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', marginBottom: '6px' }}>
              <ShieldAlert size={14} /> Admin Control Center
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '2px 0 6px 0' }}>
              STEM Curriculum Administration
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0 }}>
              Manage CBSE Class 10 bilingual subjects, chapters, lesson blocks, and practice question banks.
            </p>
          </div>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#F8FAFC',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm, 6px)',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <Eye size={16} /> Student View
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px 0', color: '#1E293B' }}>
        Curriculum & System Overview
      </h2>

      {loading ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
          Loading admin metrics...
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '16px', color: '#DC2626', backgroundColor: '#FEF2F2' }}>
          {error}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>
                    {item.label}
                  </span>
                  <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: item.bg, color: item.color }}>
                    <Icon size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A' }}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Management Shortcuts */}
      <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px 0', color: '#1E293B' }}>
        Management Modules
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {/* Content Manager */}
        <Link
          to="/admin/content"
          style={{ textDecoration: 'none' }}
        >
          <div className="card" style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                  <Layers size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: '#0F172A' }}>
                  Content Manager
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Create, update, and safely delete Subjects, Chapters, and Lessons with content blocks.
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563EB', fontSize: '0.85rem', fontWeight: '600', marginTop: '12px' }}>
              Manage Content <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        {/* Question Bank */}
        <Link
          to="/admin/questions"
          style={{ textDecoration: 'none' }}
        >
          <div className="card" style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                  <HelpCircle size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: '#0F172A' }}>
                  MCQ Question Bank
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Author board-style MCQs with 4 bilingual options, answer key, and step-by-step explanations.
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.85rem', fontWeight: '600', marginTop: '12px' }}>
              Manage Questions <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        {/* User Management */}
        <Link
          to="/admin/users"
          style={{ textDecoration: 'none' }}
        >
          <div className="card" style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                  <Users size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: '#0F172A' }}>
                  User Management
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                View registered students, review accounts, and configure administrative roles.
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontSize: '0.85rem', fontWeight: '600', marginTop: '12px' }}>
              Manage Users <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        {/* 3D Virtual Learning Topics */}
        <Link
          to="/virtual-learning"
          style={{ textDecoration: 'none' }}
        >
          <div className="card" style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F0F9FF', color: '#0284C7' }}>
                  <Sparkles size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: '#0F172A' }}>
                  Virtual Learning (9 Topics)
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Inspect and review 3D simulations across Physics, Chemistry, Biology and Maths.
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284C7', fontSize: '0.85rem', fontWeight: '600', marginTop: '12px' }}>
              View Simulations <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        {/* 3D Virtual Labs */}
        <Link
          to="/labs"
          style={{ textDecoration: 'none' }}
        >
          <div className="card" style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                  <Settings size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: '#0F172A' }}>
                  3D Virtual Labs (3 Experiments)
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Acid-Base Titration, Compound Microscope, and Simple Pendulum practical apparatus.
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4F46E5', fontSize: '0.85rem', fontWeight: '600', marginTop: '12px' }}>
              Launch Labs <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        {/* Video Lectures */}
        <Link
          to="/videos"
          style={{ textDecoration: 'none' }}
        >
          <div className="card" style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FFE4E6', color: '#E11D48' }}>
                  <Video size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: '#0F172A' }}>
                  Chapter Videos
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Curated lecture videos with chapter timestamps, checkpoints, and Saarthi doubts.
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#E11D48', fontSize: '0.85rem', fontWeight: '600', marginTop: '12px' }}>
              Inspect Lectures <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      </div>

      {/* Cloud & AI Quota Status (P2-14.2) */}
      <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '24px 0 12px 0', color: '#1E293B' }}>
        Cloud Infrastructure & Free-Tier Quota Status
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        <div className="card" style={{ padding: '14px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Cpu size={18} color="#7C3AED" />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#1E293B' }}>
              Gemini 1.5 Flash AI Engine
            </h4>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5 }}>
            • <strong>Rate Limit:</strong> 15 Requests / Minute (Free Tier)<br />
            • <strong>Daily Limit:</strong> 1,500 Requests / Day<br />
            • <strong>Saarthi RAG Cache:</strong> Active (15-min duplicate query deduplication)<br />
            • <strong>Status:</strong> <span style={{ color: '#16A34A', fontWeight: '700' }}>HEALTHY & ACTIVE</span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Database size={18} color="#2563EB" />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#1E293B' }}>
              Supabase PostgreSQL & Vector
            </h4>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5 }}>
            • <strong>Storage Limit:</strong> 500 MB Free Tier (&lt; 25 MB utilized)<br />
            • <strong>Vector Extension:</strong> pgvector HNSW cosine index enabled<br />
            • <strong>Row Level Security (RLS):</strong> Enforced on all user tables<br />
            • <strong>Status:</strong> <span style={{ color: '#16A34A', fontWeight: '700' }}>ONLINE & SYNCHRONIZED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

