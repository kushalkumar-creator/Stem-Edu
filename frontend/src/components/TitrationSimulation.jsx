import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Droplets, TrendingUp, Sparkles } from 'lucide-react';

export default function TitrationSimulation() {
  const [buretteVolume, setBuretteVolume] = useState(0); // mL dispensed (0 to 50)
  const [isDripping, setIsDripping] = useState(false);
  const [dripRate, setDripRate] = useState(0.2); // mL per tick
  const [stirring, setStirring] = useState(true);

  // Constants
  const acidVolume = 20.0; // mL
  const titrantMolarity = 0.1; // M NaOH
  const analyteMolarity = 0.1; // M HCl
  const equivalenceVolume = (analyteMolarity * acidVolume) / titrantMolarity; // 20.0 mL

  // Calculate pH based on volume of strong base added to strong acid
  const calculatePH = (vAdded) => {
    const vTotal = (acidVolume + vAdded) / 1000; // in Liters
    const molesAcidInitial = (analyteMolarity * acidVolume) / 1000;
    const molesBaseAdded = (titrantMolarity * vAdded) / 1000;

    if (vAdded < equivalenceVolume - 0.05) {
      // Acid in excess
      const molesAcidRemaining = molesAcidInitial - molesBaseAdded;
      const hConc = Math.max(1e-7, molesAcidRemaining / vTotal);
      return Math.min(6.5, Math.max(1.0, -Math.log10(hConc)));
    } else if (Math.abs(vAdded - equivalenceVolume) <= 0.05) {
      // Equivalence point
      return 7.0;
    } else {
      // Base in excess
      const molesBaseExcess = molesBaseAdded - molesAcidInitial;
      const ohConc = molesBaseExcess / vTotal;
      const pOH = -Math.log10(Math.max(1e-7, ohConc));
      return Math.max(7.5, Math.min(13.0, 14.0 - pOH));
    }
  };

  const currentPH = Number(calculatePH(buretteVolume).toFixed(2));

  // Determine solution color based on phenolphthalein indicator
  // pH < 8.2: Colorless
  // pH 8.2 - 9.5: Faint pink
  // pH > 9.5: Deep Magenta Pink
  let liquidColor = 'rgba(235, 245, 255, 0.4)'; // Clear watery
  let colorName = 'Colorless (Acidic)';
  let colorBadge = '#64748B';

  if (currentPH >= 8.2 && currentPH <= 9.6) {
    liquidColor = 'rgba(251, 113, 133, 0.55)'; // Faint pink
    colorName = 'Faint Permanent Pink (Equivalence Endpoint)';
    colorBadge = '#E11D48';
  } else if (currentPH > 9.6) {
    liquidColor = 'rgba(225, 29, 72, 0.9)'; // Deep pink
    colorName = 'Deep Magenta (Over-titrated Basic)';
    colorBadge = '#9F1239';
  }

  // Animation drip loop
  useEffect(() => {
    let timer = null;
    if (isDripping) {
      timer = setInterval(() => {
        setBuretteVolume(v => {
          if (v >= 50.0) {
            setIsDripping(false);
            return 50.0;
          }
          return Number((v + dripRate).toFixed(2));
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isDripping, dripRate]);

  const handleAddDrop = () => {
    setBuretteVolume(v => Math.min(50, Number((v + 0.05).toFixed(2))));
  };

  const handleReset = () => {
    setIsDripping(false);
    setBuretteVolume(0);
  };

  // Generate sparkline path for titration curve
  const curvePoints = [];
  for (let v = 0; v <= Math.max(buretteVolume, 35); v += 0.5) {
    const ph = calculatePH(v);
    const x = 30 + (v / 40) * 180;
    const y = 140 - (ph / 14) * 110;
    curvePoints.push(`${x},${y}`);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(280px, 1fr)', gap: '20px', alignItems: 'start' }}>
      {/* 2D / 2.5D Interactive Laboratory Apparatus Canvas */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-md)',
          position: 'relative'
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)' }}>
            Volumetric Apparatus
          </span>
          <span style={{ fontSize: '0.78rem', backgroundColor: 'white', padding: '3px 8px', borderRadius: '12px', border: '1px solid var(--color-border)', fontWeight: '600' }}>
            {colorName}
          </span>
        </div>

        {/* SVG Drawing of Burette, Stand, Stopcock, and Conical Flask */}
        <svg viewBox="0 0 320 440" style={{ width: '100%', maxWidth: '320px', height: 'auto' }}>
          {/* Iron Retort Stand */}
          <rect x="20" y="410" width="140" height="15" rx="3" fill="#334155" />
          <rect x="35" y="40" width="10" height="370" fill="#475569" />
          {/* Clamp holding burette */}
          <rect x="35" y="140" width="85" height="8" rx="2" fill="#64748B" />
          <rect x="110" y="130" width="18" height="28" rx="3" fill="#475569" />

          {/* Burette Glass Column */}
          <rect x="112" y="30" width="14" height="240" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Liquid level in burette */}
          {buretteVolume < 50 && (
            <rect
              x="113"
              y={30 + (buretteVolume / 50) * 230}
              width="12"
              height={230 - (buretteVolume / 50) * 230}
              fill="#93C5FD"
              opacity="0.8"
            />
          )}

          {/* Burette Graduations */}
          {[0, 10, 20, 30, 40, 50].map((tick) => (
            <g key={tick}>
              <line x1="126" y1={30 + (tick / 50) * 230} x2="132" y2={30 + (tick / 50) * 230} stroke="#475569" strokeWidth="1" />
              <text x="136" y={34 + (tick / 50) * 230} fontSize="7" fill="#64748B" fontFamily="monospace">{tick}</text>
            </g>
          ))}

          {/* Stopcock valve */}
          <rect x="107" y="270" width="24" height="10" rx="2" fill={isDripping ? '#22C55E' : '#EF4444'} />
          <circle cx="119" cy="275" r="4" fill="#FFFFFF" />

          {/* Dripping drops animation */}
          {isDripping && (
            <circle cx="119" cy="300" r="3" fill="#60A5FA">
              <animate attributeName="cy" from="285" to="340" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0.2" dur="0.5s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Conical Flask (Erlenmeyer) */}
          <polygon
            points="105,335 133,335 175,410 63,410"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Liquid inside conical flask */}
          <polygon
            points="95,360 143,360 173,408 65,408"
            fill={liquidColor}
            style={{ transition: 'fill 0.4s ease' }}
          />

          {/* Magnetic stir bar in flask */}
          <rect
            x="110"
            y="400"
            width="18"
            height="5"
            rx="2.5"
            fill="#FFFFFF"
            stroke="#94A3B8"
            strokeWidth="0.8"
            style={{
              transformOrigin: '119px 402px',
              animation: stirring ? 'spin 1s linear infinite' : 'none'
            }}
          />
        </svg>

        {/* Live HUD Readout */}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: '600' }}>NaOH Dispensed</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-primary)' }}>{buretteVolume.toFixed(2)} mL</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: '600' }}>Solution pH</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: colorBadge }}>{currentPH}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: '600' }}>HCl Volume</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)' }}>20.0 mL</div>
          </div>
        </div>
      </div>

      {/* Right Column: Controls & Real-Time Titration Curve Chart */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>
            Titration Controls
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>
            Operate the burette stopcock to add NaOH titrant until the solution turns faint permanent pink.
          </p>
        </div>

        {/* Flow Controls */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsDripping(!isDripping)}
            className={`btn ${isDripping ? 'btn-secondary' : 'btn-primary'}`}
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {isDripping ? <Pause size={16} /> : <Play size={16} />}
            <span>{isDripping ? 'Stop Flow' : 'Start Continuous Flow'}</span>
          </button>

          <button
            onClick={handleAddDrop}
            disabled={isDripping || buretteVolume >= 50}
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Droplets size={15} /> Add 1 Drop (0.05 mL)
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            title="Reset Experiment"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Flow Speed Slider */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Flow Rate</span>
            <span>{dripRate} mL / step</span>
          </label>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={dripRate}
            onChange={(e) => setDripRate(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Live Titration Curve (pH vs Volume) */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={15} color="var(--color-primary)" />
              Live Titration Curve (pH vs V_NaOH)
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: colorBadge }}>
              pH: {currentPH}
            </span>
          </div>

          <svg viewBox="0 0 240 160" style={{ width: '100%', height: 'auto', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            {/* Grid & Axes */}
            <line x1="30" y1="20" x2="30" y2="140" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="30" y1="140" x2="220" y2="140" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* pH 7 Equivalence Line */}
            <line x1="30" y1="85" x2="220" y2="85" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 3" />
            <text x="5" y="88" fontSize="8" fill="#D97706" fontWeight="bold">pH 7</text>

            {/* Axis labels */}
            <text x="5" y="25" fontSize="8" fill="#64748B">14</text>
            <text x="12" y="143" fontSize="8" fill="#64748B">0</text>
            <text x="110" y="155" fontSize="8" fill="#64748B" textAnchor="middle">Volume NaOH (mL)</text>
            <text x="210" y="152" fontSize="7" fill="#64748B">40</text>

            {/* Curve plot */}
            {curvePoints.length > 1 && (
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                points={curvePoints.join(' ')}
              />
            )}

            {/* Current point marker */}
            <circle
              cx={30 + (buretteVolume / 40) * 180}
              cy={140 - (currentPH / 14) * 110}
              r="4"
              fill={colorBadge}
            />
          </svg>
        </div>

        {/* Equivalence Point Deduction & Formula */}
        <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: '700', color: 'var(--color-primary)', marginBottom: '4px' }}>
            Quantitative Formula:
          </div>
          <div style={{ fontFamily: 'monospace', fontWeight: '600' }}>
            M₁ × V₁ (Acid) = M₂ × V₂ (Base)
          </div>
          <div style={{ marginTop: '4px', color: 'var(--color-text)', fontSize: '0.8rem' }}>
            M(HCl) = (0.10 M × {buretteVolume.toFixed(1)} mL) / 20.0 mL = <strong>{((0.1 * buretteVolume) / 20).toFixed(3)} M</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
