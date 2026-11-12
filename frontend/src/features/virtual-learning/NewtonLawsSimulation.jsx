import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ShieldAlert, Award } from 'lucide-react';

/**
 * Newton's Laws of Motion Simulation (P2-8.6)
 * CBSE Class 9, 10 & 11 Physics:
 * - Law 1: Law of Inertia (frictionless motion vs kinetic friction damping).
 * - Law 2: F = ma (Force and Mass controls, live dynamic acceleration graph).
 * - Law 3: Action & Reaction (Equal and opposite momentum recoil carts).
 */
export default function NewtonLawsSimulation() {
  const [activeLaw, setActiveLaw] = useState(2); // 1 | 2 | 3

  // Law 1 state
  const [frictionOn, setFrictionOn] = useState(true);
  const [law1Vel, setLaw1Vel] = useState(4);
  const [law1Pos, setLaw1Pos] = useState(40);

  // Law 2 state
  const [force, setForce] = useState(20); // Newtons
  const [mass, setMass] = useState(4); // kg
  const [law2Pos, setLaw2Pos] = useState(40);
  const [law2Vel, setLaw2Vel] = useState(0);

  // Law 3 state
  const [cart1Mass, setCart1Mass] = useState(2); // kg
  const [cart2Mass, setCart2Mass] = useState(4); // kg
  const [cart1Pos, setCart1Pos] = useState(300);
  const [cart2Pos, setCart2Pos] = useState(380);
  const [cart1Vel, setCart1Vel] = useState(0);
  const [cart2Vel, setCart2Vel] = useState(0);
  const [isExploded, setIsExploded] = useState(false);

  const [isRunning, setIsRunning] = useState(true);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Computed Law 2 acceleration
  const acceleration = Math.round((force / (mass || 1)) * 100) / 100;

  // Reset function
  const handleReset = () => {
    setLaw1Pos(40);
    setLaw1Vel(4);

    setLaw2Pos(40);
    setLaw2Vel(0);

    setCart1Pos(320);
    setCart2Pos(380);
    setCart1Vel(0);
    setCart2Vel(0);
    setIsExploded(false);
  };

  // Trigger Law 3 spring release
  const handleSpringRelease = () => {
    const impulse = 30; // N*s
    const v1 = -impulse / cart1Mass;
    const v2 = impulse / cart2Mass;
    setCart1Vel(v1);
    setCart2Vel(v2);
    setIsExploded(true);
  };

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Floor / Track
      const groundY = height - 60;
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, groundY, width, 60);

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      if (activeLaw === 1) {
        // Law 1: Law of Inertia
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Law 1: Law of Inertia (Friction: ${frictionOn ? 'ON (μ = 0.05)' : 'OFF (μ = 0, Ideal Vacuum)'})`, 20, 25);

        // Draw Block
        const blockW = 60;
        const blockH = 40;
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(law1Pos, groundY - blockH, blockW, blockH);
        ctx.strokeStyle = '#1D4ED8';
        ctx.lineWidth = 2;
        ctx.strokeRect(law1Pos, groundY - blockH, blockW, blockH);

        // Mass label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('m = 5 kg', law1Pos + 10, groundY - blockH + 24);

        // Velocity vector arrow
        if (Math.abs(law1Vel) > 0.01) {
          ctx.beginPath();
          ctx.moveTo(law1Pos + blockW, groundY - blockH / 2);
          ctx.lineTo(law1Pos + blockW + law1Vel * 12, groundY - blockH / 2);
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#10B981';
          ctx.fillText(`v = ${law1Vel.toFixed(1)} m/s`, law1Pos + blockW + 10, groundY - blockH / 2 - 8);
        } else {
          ctx.fillStyle = '#EF4444';
          ctx.fillText('At Rest (v = 0)', law1Pos, groundY - blockH - 8);
        }

        // Physics step
        if (isRunning) {
          setLaw1Pos((prev) => {
            let nextPos = prev + law1Vel;
            if (nextPos > width - 70) {
              setLaw1Vel((v) => -v * 0.8);
              return width - 70;
            }
            if (nextPos < 10) {
              setLaw1Vel((v) => -v * 0.8);
              return 10;
            }
            return nextPos;
          });

          if (frictionOn) {
            setLaw1Vel((prev) => {
              if (Math.abs(prev) < 0.02) return 0;
              return prev * 0.992;
            });
          }
        }
      } else if (activeLaw === 2) {
        // Law 2: F = ma
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Law 2: F = ma → a = F / m = ${force} N / ${mass} kg = ${acceleration} m/s²`, 20, 25);

        const blockW = 50 + mass * 5;
        const blockH = 45;

        // Draw Block
        ctx.fillStyle = '#8B5CF6';
        ctx.fillRect(law2Pos, groundY - blockH, blockW, blockH);
        ctx.strokeStyle = '#6D28D9';
        ctx.lineWidth = 2;
        ctx.strokeRect(law2Pos, groundY - blockH, blockW, blockH);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${mass} kg`, law2Pos + blockW / 2 - 14, groundY - blockH / 2 + 5);

        // Force vector arrow
        ctx.beginPath();
        ctx.moveTo(law2Pos + blockW, groundY - blockH / 2);
        ctx.lineTo(law2Pos + blockW + force * 2.5, groundY - blockH / 2);
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`F = ${force} N →`, law2Pos + blockW + 10, groundY - blockH / 2 - 8);

        // Wheels
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(law2Pos + 12, groundY - 4, 6, 0, Math.PI * 2);
        ctx.arc(law2Pos + blockW - 12, groundY - 4, 6, 0, Math.PI * 2);
        ctx.fill();

        // Physics step
        if (isRunning) {
          setLaw2Vel((v) => v + acceleration * 0.016);
          setLaw2Pos((p) => {
            const next = p + law2Vel;
            if (next > width - blockW - 10) return 20; // Loop around track
            return next;
          });
        }
      } else if (activeLaw === 3) {
        // Law 3: Action & Reaction
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Law 3: Action and Reaction are Equal and Opposite (F₁₂ = -F₂₁)', 20, 25);

        // Cart 1
        const c1W = 60;
        const c1H = 35;
        ctx.fillStyle = '#10B981';
        ctx.fillRect(cart1Pos, groundY - c1H, c1W, c1H);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${cart1Mass} kg`, cart1Pos + 16, groundY - c1H / 2 + 4);

        // Cart 2
        const c2W = 60;
        const c2H = 35;
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(cart2Pos, groundY - c2H, c2W, c2H);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${cart2Mass} kg`, cart2Pos + 16, groundY - c2H / 2 + 4);

        // Momentum readout
        ctx.fillStyle = '#475569';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Cart 1: v = ${cart1Vel.toFixed(2)} m/s (p = ${(cart1Mass * cart1Vel).toFixed(1)} kg·m/s)`, 20, 50);
        ctx.fillText(`Cart 2: v = ${cart2Vel.toFixed(2)} m/s (p = ${(cart2Mass * cart2Vel).toFixed(1)} kg·m/s)`, width - 300, 50);

        if (isRunning && isExploded) {
          setCart1Pos((p) => Math.max(10, p + cart1Vel));
          setCart2Pos((p) => Math.min(width - 70, p + cart2Vel));
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [activeLaw, isRunning, frictionOn, law1Vel, law1Pos, force, mass, acceleration, law2Pos, law2Vel, cart1Pos, cart2Pos, cart1Vel, cart2Vel, isExploded, cart1Mass, cart2Mass]);

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Law Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
          {[
            { id: 1, label: "Law 1: Inertia" },
            { id: 2, label: "Law 2: F = ma" },
            { id: 3, label: "Law 3: Action & Reaction" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveLaw(tab.id);
                handleReset();
              }}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeLaw === tab.id ? '#7C3AED' : 'transparent',
                color: activeLaw === tab.id ? '#FFFFFF' : '#64748B'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
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
            {isRunning ? <Pause size={14} /> : <Play size={14} />} {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button
            type="button"
            onClick={handleReset}
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
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div style={{ width: '100%', height: '240px', backgroundColor: '#F8FAFC', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={240}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Interactive Controls based on Active Law */}
      {activeLaw === 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E40AF' }}>Galileo's Frictionless Plane Demo</div>
            <div style={{ fontSize: '0.75rem', color: '#3B82F6' }}>
              An object in motion remains in uniform rectilinear motion unless acted upon by an external net unbalanced force.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFrictionOn(!frictionOn)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: frictionOn ? '#EF4444' : '#10B981',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            {frictionOn ? 'Disable Friction (Ideal Space)' : 'Enable Friction'}
          </button>
        </div>
      )}

      {activeLaw === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
              <span>Applied Force (F):</span>
              <span style={{ color: '#EF4444', fontWeight: '800' }}>{force} N</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={force}
              onChange={(e) => setForce(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
              <span>Cart Mass (m):</span>
              <span style={{ color: '#7C3AED', fontWeight: '800' }}>{mass} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={mass}
              onChange={(e) => setMass(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 12px', backgroundColor: '#FAF5FF', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
            <span style={{ fontSize: '0.7rem', color: '#7E22CE', fontWeight: '700' }}>Resulting Acceleration:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#581C87' }}>{acceleration} m/s²</span>
          </div>
        </div>
      )}

      {activeLaw === 3 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 16px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#15803D' }}>Compressed Spring Recoil Test</div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>
              Observe conservation of linear momentum: m₁v₁ + m₂v₂ = 0.
            </div>
          </div>
          <button
            type="button"
            onClick={handleSpringRelease}
            disabled={isExploded}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isExploded ? '#94A3B8' : '#15803D',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: isExploded ? 'not-allowed' : 'pointer'
            }}
          >
            {isExploded ? 'Spring Released' : 'Release Compressed Spring'}
          </button>
        </div>
      )}
    </div>
  );
}

