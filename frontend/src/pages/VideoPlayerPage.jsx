import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle,
  HelpCircle,
  List,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VideoPlayerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Player controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters'); // 'chapters' | 'transcript'

  // Interactive Checkpoint state (P2-10.2)
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [checkpointAnswered, setCheckpointAnswered] = useState(false);
  const [checkpointResult, setCheckpointResult] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (data.success && data.videos) {
          setVideos(data.videos);
          setSelectedVideo(data.videos[0]);
        }
      } catch (err) {
        console.error('Failed to load videos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // Time update listener
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = Math.floor(videoRef.current.currentTime);
    setCurrentTime(curr);

    // Trigger checkpoint if reaching checkpoint time and not yet answered
    if (selectedVideo?.checkpoint && curr >= selectedVideo.checkpoint.time && !checkpointAnswered && !activeCheckpoint) {
      videoRef.current.pause();
      setIsPlaying(false);
      setActiveCheckpoint(selectedVideo.checkpoint);
    }
  };

  const handleSeek = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    setActiveCheckpoint(null);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSpeedChange = (speed) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleCheckpointOption = (optionIndex) => {
    if (!activeCheckpoint) return;
    const isCorrect = optionIndex === activeCheckpoint.correctIndex;
    setCheckpointResult(isCorrect);
    setCheckpointAnswered(true);
  };

  const handleResumeAfterCheckpoint = () => {
    setActiveCheckpoint(null);
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleAskSaarthiAtTimestamp = () => {
    const mins = Math.floor(currentTime / 60);
    const secs = String(currentTime % 60).padStart(2, '0');
    const timeFormatted = `${mins}:${secs}`;
    const prompt = `In the chapter video "${selectedVideo.title}" at timestamp [${timeFormatted}]: Can you explain this concept in detail from NCERT and test my understanding?`;
    navigate('/mentor', { state: { prefill: prompt, subject: selectedVideo.subject } });
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading || !selectedVideo) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-primary)' }}>
        Loading video lectures...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Play size={24} color="var(--color-primary)" /> Video Learning Player
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', margin: '4px 0 0 0' }}>
          Interactive video lessons with chapter timestamps, real-time concept checkpoint quizzes, and Saarthi mentor integration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(260px, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Video Player & Controls */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#000000', color: 'white' }}>
          {/* Video Container */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', backgroundColor: '#000' }}>
            <video
              ref={videoRef}
              src={selectedVideo.videoUrl}
              poster={selectedVideo.thumbnailUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || selectedVideo.durationSeconds)}
              onEnded={() => setIsPlaying(false)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              playsInline
            />

            {/* Checkpoint Overlay (P2-10.2) */}
            {activeCheckpoint && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '24px',
                  textAlign: 'center',
                  zIndex: 10
                }}
              >
                <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '6px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '10px' }}>
                  Interactive Video Checkpoint
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '14px', maxWidth: '480px' }}>
                  {activeCheckpoint.question}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', maxWidth: '440px', marginBottom: '14px' }}>
                  {activeCheckpoint.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleCheckpointOption(optIdx)}
                      disabled={checkpointAnswered}
                      className="btn btn-secondary"
                      style={{
                        padding: '10px',
                        fontSize: '0.85rem',
                        textAlign: 'left',
                        backgroundColor: checkpointAnswered
                          ? optIdx === activeCheckpoint.correctIndex
                            ? '#059669'
                            : '#DC2626'
                          : 'white',
                        color: checkpointAnswered ? 'white' : '#0F172A'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {checkpointAnswered && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '0.85rem', color: checkpointResult ? '#34D399' : '#F87171', fontWeight: '600' }}>
                      {checkpointResult ? '✓ Correct! Great job.' : '✗ Incorrect. ' + activeCheckpoint.explanation}
                    </div>
                    <button
                      onClick={handleResumeAfterCheckpoint}
                      className="btn btn-primary"
                      style={{ width: 'auto', padding: '8px 20px', fontSize: '0.85rem' }}
                    >
                      Continue Video Lesson
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Custom Controls Bar */}
          <div style={{ padding: '12px 16px', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Scrubber Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{formatSeconds(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                style={{ flex: 1, cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{formatSeconds(duration)}</span>
            </div>

            {/* Bottom Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={togglePlay}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={() => handleSeek(0)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                  title="Replay from start"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => {
                    if (!videoRef.current) return;
                    videoRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>

              {/* Speed & Ask Saarthi at Timestamp */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  style={{ backgroundColor: '#1E293B', color: 'white', border: '1px solid #334155', borderRadius: '4px', padding: '4px 6px', fontSize: '0.75rem' }}
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1.0x Normal</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2.0x</option>
                </select>

                <button
                  onClick={handleAskSaarthiAtTimestamp}
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={13} /> Ask Saarthi at {formatSeconds(currentTime)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timestamps & Video Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Video Metadata Card */}
          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '999px' }}>
              {selectedVideo.subject} • Class {selectedVideo.classLevel}
            </span>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '8px 0 4px 0' }}>
              {selectedVideo.title}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              Chapter: {selectedVideo.chapterTitle} • Duration: {formatSeconds(selectedVideo.durationSeconds)}
            </div>
          </div>

          {/* Chapter Timestamps & Bookmarks (P2-10.5) */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => setActiveTab('chapters')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: activeTab === 'chapters' ? 'var(--color-primary)' : 'var(--color-muted)',
                  cursor: 'pointer'
                }}
              >
                Chapter Timestamps
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: activeTab === 'transcript' ? 'var(--color-primary)' : 'var(--color-muted)',
                  cursor: 'pointer'
                }}
              >
                Transcript
              </button>
            </div>

            {activeTab === 'chapters' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedVideo.timestamps.map((ts, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(ts.time)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: currentTime >= ts.time && (idx === selectedVideo.timestamps.length - 1 || currentTime < selectedVideo.timestamps[idx + 1].time)
                        ? 'var(--color-primary-light)'
                        : 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: '600' }}>{ts.title}</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-primary)', fontWeight: '700' }}>
                      {formatSeconds(ts.time)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                {selectedVideo.transcript}
              </div>
            )}
          </div>

          {/* More Chapter Videos */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Other Subject Video Lectures
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {videos.map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVideo(v);
                    setCheckpointAnswered(false);
                    setActiveCheckpoint(null);
                    setCurrentTime(0);
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedVideo.id === v.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: selectedVideo.id === v.id ? 'var(--color-primary-light)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <img src={v.thumbnailUrl} alt={v.title} style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A' }}>{v.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{v.subject} • Class {v.classLevel}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
