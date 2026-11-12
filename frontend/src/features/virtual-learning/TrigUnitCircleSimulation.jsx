import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';

/**
 * Trigonometric Unit Circle Simulation (P2-8.8)
 * CBSE Class 10 & 11 Mathematics: Unit Circle (r = 1), sin/cos/tan geometric projections,
 * ASTC Quadrant Rule, and Pythagorean Identity proof.
 */
export default function TrigUnitCircleSimulation() {
  const [angleDeg, setAngleDeg] = useState(45); // 0 to 360
  const [isRadians, setIsRadians] = useState(false);
  const [showTangent, setShowTangent] = useState(true);

  const canvasRef = useRef(null);

  const rad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.abs(cosVal) > 0.0001 ? Math.tan(rad) : (sinVal > 0 ? Infinity : -Infinity);

  // Quadrant classification
  const getQuadrant = (deg) => {
    const d = deg % 360;
    if (d >= 0 && d < 90) return { q: 'I', label: 'Quadrant I (All +)' };
    if (d >= 90 && d < 180) return { q: 'II', label: 'Quadrant II (Sin +)' };
    if (d >= 180 && d < 270) return { q: 'III', label: 'Quadrant III (Tan +)' };
    return { q: 'IV', label: 'Quadrant IV (Cos +)' };
  };

  const quadrantInfo = getQuadrant(angleDeg);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const R = 110; // Radius in pixels

    // Background grid
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, cy);
    ctx.lineTo(width - 20, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, height - 20);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748B';
    ctx.font = '10px sans-serif';
    ctx.fillText('+X (cos)', width - 45, cy - 8);
    ctx.fillText('+Y (sin)', cx + 8, 30);
    ctx.fillText('-X', 25, cy - 8);
    ctx.fillText('-Y', cx + 8, height - 25);

    // Unit circle
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Terminal point coords
    const px = cx + R * Math.cos(rad);
    const py = cy - R * Math.sin(rad); // canvas Y inverted

    // Angle sector / arc
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 32, 0, -rad, true);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Radius line to point P
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Cos projection (horizontal line on X-axis)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.strokeStyle = '#2563EB'; // Blue for Cos
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Sin projection (vertical line from X-axis to P)
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = '#DC2626'; // Red for Sin
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Tangent Line
    if (showTangent && Math.abs(cosVal) > 0.05) {
      // Tangent line at (cx + R, cy)
      const tanY = cy - R * tanVal;
      ctx.beginPath();
      ctx.moveTo(cx + R, cy);
      ctx.lineTo(cx + R, Math.max(10, Math.min(height - 10, tanY)));
      ctx.strokeStyle = '#059669'; // Green for Tan
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Terminal point P (cos θ, sin θ)
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#4F46E5';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Coordinates tooltip
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(
      `P(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`,
      px + (cosVal >= 0 ? 10 : -95),
      py + (sinVal >= 0 ? -10 : 20)
    );
  }, [angleDeg, rad, sinVal, cosVal, tanVal, showTangent]);

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Header and Presets */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B' }}>Standard CBSE Angles:</span>
          {[0, 30, 45, 60, 90, 180, 270, 360].map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => setAngleDeg(deg)}
              style={{
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: angleDeg === deg ? '#4F46E5' : '#F8FAFC',
                color: angleDeg === deg ? '#FFFFFF' : '#475569',
                cursor: 'pointer'
              }}
            >
              {deg}°
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsRadians(!isRadians)}
            style={{
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F1F5F9',
              cursor: 'pointer'
            }}
          >
            Mode: {isRadians ? 'Radians (π)' : 'Degrees (°)'}
          </button>
          <button
            type="button"
            onClick={() => setShowTangent(!showTangent)}
            style={{
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: showTangent ? '#ECFDF5' : '#F8FAFC',
              color: showTangent ? '#059669' : '#64748B',
              cursor: 'pointer'
            }}
          >
            Tangent Line: {showTangent ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
        <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', height: '320px', position: 'relative', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>

        {/* Live Mathematical Calculations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '10px 14px', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: '0.7rem', color: '#1D4ED8', fontWeight: '700' }}>cos θ (Adjacent / Base)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E3A8A' }}>{cosVal.toFixed(4)}</div>
            <div style={{ fontSize: '0.65rem', color: '#3B82F6' }}>Horizontal projection on X-axis</div>
          </div>

          <div style={{ padding: '10px 14px', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <div style={{ fontSize: '0.7rem', color: '#B91C1C', fontWeight: '700' }}>sin θ (Opposite / Perpendicular)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#991B1B' }}>{sinVal.toFixed(4)}</div>
            <div style={{ fontSize: '0.65rem', color: '#EF4444' }}>Vertical projection on Y-axis</div>
          </div>

          <div style={{ padding: '10px 14px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
            <div style={{ fontSize: '0.7rem', color: '#047857', fontWeight: '700' }}>tan θ = sin θ / cos θ</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#064E3B' }}>
              {Math.abs(tanVal) > 1000 ? 'Undefined (±∞)' : tanVal.toFixed(4)}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#10B981' }}>Slope of terminal radius</div>
          </div>

          {/* Quadrant & Identity Proof */}
          <div style={{ padding: '8px 12px', backgroundColor: '#FAF5FF', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
            <div style={{ fontSize: '0.68rem', color: '#7E22CE', fontWeight: '700' }}>ASTC Rule & Identity:</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#581C87', marginTop: '2px' }}>
              {quadrantInfo.label}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6B21A8', marginTop: '4px', fontFamily: 'monospace' }}>
              sin²θ + cos²θ = { (sinVal * sinVal + cosVal * cosVal).toFixed(2) } = 1
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px' }}>
          <span>Adjust Angle θ:</span>
          <span style={{ color: '#4F46E5' }}>
            {angleDeg}° {isRadians && `≈ ${(rad / Math.PI).toFixed(2)}π rad`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={angleDeg}
          onChange={(e) => setAngleDeg(parseInt(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
