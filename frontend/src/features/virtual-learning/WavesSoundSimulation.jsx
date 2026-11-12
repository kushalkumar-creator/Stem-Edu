import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Activity, Layers, Info } from 'lucide-react';

/**
 * Waves & Sound Simulation (P2-8.5)
 * CBSE Class 10 & 12 Physics: Wave equation v = f * lambda, transverse vs longitudinal waves,
 * harmonic superposition, and Web Audio API tone generator.
 */
export default function WavesSoundSimulation() {
  const [waveType, setWaveType] = useState('transverse'); // 'transverse' | 'longitudinal' | 'superposition'
  const [frequency, setFrequency] = useState(2); // Hz in simulation
  const [amplitude, setAmplitude] = useState(35); // pixels
  const [soundFreq, setSoundFreq] = useState(440); // Audible Hz (A4)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [volume, setVolume] = useState(0.2); // 0.0 to 1.0 safe default
  const [isAnimating, setIsAnimating] = useState(true);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainNodeRef = useRef(null);
  const timeRef = useRef(0);
  const animFrameRef = useRef(null);

  // Web Audio API controls
  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(soundFreq, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        oscRef.current = osc;
        gainNodeRef.current = gain;
        setIsPlayingAudio(true);
      } catch (err) {
        console.warn('AudioContext error:', err);
      }
    }
  };

  // Update audio frequency in real time
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setTargetAtTime(soundFreq, audioCtxRef.current.currentTime, 0.05);
    }
  }, [soundFreq]);

  // Update audio volume in real time
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (_) {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (_) {}
      }
    };
  }, []);

  // Animation Loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerY = height / 2;

      // Equilibrium baseline
      ctx.strokeStyle = '#CBD5E1';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      const t = timeRef.current;
      const k = 0.025; // wave number
      const omega = frequency * 2; // angular velocity

      if (waveType === 'transverse') {
        // Draw primary transverse sine wave
        ctx.beginPath();
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 3;
        for (let x = 0; x < width; x++) {
          const y = centerY + amplitude * Math.sin(k * x - omega * t);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Particles moving vertically
        for (let x = 40; x < width; x += 60) {
          const y = centerY + amplitude * Math.sin(k * x - omega * t);
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#DC2626';
          ctx.fill();

          // Particle velocity vector indicator
          const vy = -amplitude * omega * Math.cos(k * x - omega * t) * 0.15;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + vy);
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Labels
        ctx.fillStyle = '#1E293B';
        ctx.font = '11px sans-serif';
        ctx.fillText('Crest (Max +A)', 10, centerY - amplitude - 8);
        ctx.fillText('Trough (Min -A)', 10, centerY + amplitude + 16);
      } else if (waveType === 'longitudinal') {
        // Draw Longitudinal Wave (Particles in air column compressing & rarefacting)
        const rows = 5;
        const cols = 50;
        const spacingX = width / cols;
        const spacingY = 24;

        for (let r = 0; r < rows; r++) {
          const py = centerY - ((rows - 1) * spacingY) / 2 + r * spacingY;
          for (let c = 0; c < cols; c++) {
            const baseX = c * spacingX;
            // Horizontal displacement: s = s_0 * cos(kx - omega*t)
            const dx = (amplitude * 0.6) * Math.cos(k * baseX - omega * t);
            const px = baseX + dx;

            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            // Color based on density/compression
            const compression = -Math.sin(k * baseX - omega * t);
            if (compression > 0.4) {
              ctx.fillStyle = '#EF4444'; // Dense (Compression)
            } else if (compression < -0.4) {
              ctx.fillStyle = '#3B82F6'; // Rare (Rarefaction)
            } else {
              ctx.fillStyle = '#64748B';
            }
            ctx.fill();
          }
        }

        // Compression / Rarefaction annotations
        ctx.fillStyle = '#DC2626';
        ctx.font = '12px sans-serif';
        ctx.fillText('Compression (High Pressure)', 30, centerY - 65);
        ctx.fillStyle = '#2563EB';
        ctx.fillText('Rarefaction (Low Pressure)', width - 210, centerY - 65);
      } else if (waveType === 'superposition') {
        // Wave 1: Blue
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x++) {
          const y1 = centerY + (amplitude * 0.6) * Math.sin(k * x - omega * t);
          if (x === 0) ctx.moveTo(x, y1);
          else ctx.lineTo(x, y1);
        }
        ctx.stroke();

        // Wave 2: Green (opposite direction, standing wave)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x++) {
          const y2 = centerY + (amplitude * 0.6) * Math.sin(k * x + omega * t);
          if (x === 0) ctx.moveTo(x, y2);
          else ctx.lineTo(x, y2);
        }
        ctx.stroke();

        // Resultant Superposition Wave: Purple
        ctx.beginPath();
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 3;
        for (let x = 0; x < width; x++) {
          const y1 = (amplitude * 0.6) * Math.sin(k * x - omega * t);
          const y2 = (amplitude * 0.6) * Math.sin(k * x + omega * t);
          const yResult = centerY + (y1 + y2);
          if (x === 0) ctx.moveTo(x, yResult);
          else ctx.lineTo(x, yResult);
        }
        ctx.stroke();

        ctx.fillStyle = '#7C3AED';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Resultant Wave y = y₁ + y₂ (Standing Wave Interference)', 20, 25);
      }

      if (isAnimating) {
        timeRef.current += 0.025;
      }
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [waveType, frequency, amplitude, isAnimating]);

  const wavelength = Math.round(340 / (soundFreq || 1) * 100) / 100;

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Controls Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
          {[
            { id: 'transverse', label: 'Transverse Wave' },
            { id: 'longitudinal', label: 'Longitudinal Wave' },
            { id: 'superposition', label: 'Superposition' }
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setWaveType(m.id)}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: waveType === m.id ? '#2563EB' : 'transparent',
                color: waveType === m.id ? '#FFFFFF' : '#64748B'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsAnimating(!isAnimating)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isAnimating ? <Pause size={14} /> : <Play size={14} />} {isAnimating ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            onClick={toggleAudio}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isPlayingAudio ? '#EF4444' : '#10B981',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {isPlayingAudio ? 'Mute Tone' : 'Play Sound Tone'}
          </button>
        </div>
      </div>

      {/* Main Wave Canvas */}
      <div style={{ width: '100%', height: '220px', backgroundColor: '#F8FAFC', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={220}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Numerical Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
        <div style={{ padding: '8px 12px', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
          <div style={{ fontSize: '0.7rem', color: '#1D4ED8', fontWeight: '700' }}>Wave Speed (v)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1E3A8A' }}>340 m/s</div>
          <div style={{ fontSize: '0.65rem', color: '#60A5FA' }}>Speed of sound in dry air (20°C)</div>
        </div>

        <div style={{ padding: '8px 12px', backgroundColor: '#FAF5FF', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
          <div style={{ fontSize: '0.7rem', color: '#7E22CE', fontWeight: '700' }}>Frequency (f)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#581C87' }}>{soundFreq} Hz</div>
          <div style={{ fontSize: '0.65rem', color: '#A855F7' }}>Pitch: {soundFreq > 800 ? 'High / Shrill' : 'Low / Bass'}</div>
        </div>

        <div style={{ padding: '8px 12px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: '700' }}>Wavelength (λ)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#14532D' }}>{wavelength} m</div>
          <div style={{ fontSize: '0.65rem', color: '#4ADE80' }}>λ = v / f</div>
        </div>

        <div style={{ padding: '8px 12px', backgroundColor: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: '700' }}>Amplitude (A)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#78350F' }}>{amplitude} px</div>
          <div style={{ fontSize: '0.65rem', color: '#F59E0B' }}>Loudness ∝ A²</div>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
            <span>Visual Frequency:</span>
            <span>{frequency} Hz</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
            <span>Wave Amplitude:</span>
            <span>{amplitude} px</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="2"
            value={amplitude}
            onChange={(e) => setAmplitude(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
            <span>Audible Tone Frequency:</span>
            <span>{soundFreq} Hz</span>
          </div>
          <input
            type="range"
            min="100"
            max="1200"
            step="10"
            value={soundFreq}
            onChange={(e) => setSoundFreq(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
            <span>Audio Volume (Mute safe):</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}
