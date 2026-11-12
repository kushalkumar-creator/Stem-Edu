import React, { useState } from 'react';
import { Eye, RotateCcw, ZoomIn, Sun, Layers, Info } from 'lucide-react';

const SPECIMENS = [
  {
    id: 'onion_peel',
    name: 'Onion Peel Cells (Plant Tissue)',
    targetFocus: 50,
    baseScale: 1.0,
    stain: 'Safranin (Pinkish-Red)',
    description: 'Epidermal cells of Allium cepa showing distinct rectangular cell walls and peripheral nuclei pushed by central vacuoles.',
    organelles: [
      { name: 'Cell Wall', x: 45, y: 35, note: 'Rigid protective cellulose barrier maintaining structural integrity' },
      { name: 'Nucleus', x: 65, y: 55, note: 'Dark stained dense organelle containing genetic material' },
      { name: 'Cytoplasm', x: 50, y: 70, note: 'Granular semi-fluid matrix where metabolic reactions occur' }
    ]
  },
  {
    id: 'cheek_cell',
    name: 'Human Cheek Epithelial Cells (Animal Tissue)',
    targetFocus: 45,
    baseScale: 1.2,
    stain: 'Methylene Blue (Deep Blue)',
    description: 'Stratified squamous epithelial cells from the inner cheek lining, irregular polygonal shapes with prominent central nuclei.',
    organelles: [
      { name: 'Cell Membrane', x: 48, y: 32, note: 'Thin flexible phospholipid bilayer; cell wall is absent' },
      { name: 'Central Nucleus', x: 52, y: 52, note: 'Centrally located spherical nucleus stained dark blue' },
      { name: 'Cytoplasm', x: 62, y: 65, note: 'Transparent ground substance without large vacuoles' }
    ]
  },
  {
    id: 'amoeba',
    name: 'Amoeba Proteus (Microscopic Protist)',
    targetFocus: 55,
    baseScale: 1.1,
    stain: 'Live Wet Mount',
    description: 'Unicellular freshwater amoeboid protozoan continuously extending pseudopodia for amoeboid locomotion and phagocytosis.',
    organelles: [
      { name: 'Pseudopodium', x: 30, y: 40, note: 'False foot formed by cytoplasmic streaming for locomotion' },
      { name: 'Contractile Vacuole', x: 68, y: 38, note: 'Osmoregulatory organelle expelling excess water' },
      { name: 'Food Vacuole', x: 55, y: 65, note: 'Digests ingested bacterial prey via enzymatic hydrolysis' }
    ]
  }
];

export default function MicroscopeSimulation() {
  const [selectedSpecimen, setSelectedSpecimen] = useState(SPECIMENS[0]);
  const [objectiveLens, setObjectiveLens] = useState(40); // 10x, 40x, 100x
  const [coarseFocus, setCoarseFocus] = useState(30);     // 0 to 100
  const [fineFocus, setFineFocus] = useState(20);         // 0 to 100
  const [lightIntensity, setLightIntensity] = useState(85); // 20 to 100
  const [selectedOrganelle, setSelectedOrganelle] = useState(null);

  const totalMagnification = 10 * objectiveLens; // Eyepiece is 10x

  // Combined focus calculation: Target is selectedSpecimen.targetFocus
  // Optimal when (coarseFocus * 0.7 + fineFocus * 0.3) is close to targetFocus
  const effectiveFocus = (coarseFocus * 0.7) + (fineFocus * 0.3);
  const focusDiff = Math.abs(effectiveFocus - selectedSpecimen.targetFocus);
  const blurPx = Math.min(16, (focusDiff * 0.4).toFixed(1));
  const isInSharpFocus = focusDiff < 4.0;

  const handleReset = () => {
    setCoarseFocus(30);
    setFineFocus(20);
    setObjectiveLens(40);
    setSelectedOrganelle(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(280px, 1fr)', gap: '20px', alignItems: 'start' }}>
      {/* Microscope Circular Field of View Canvas */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#0F172A',
          color: 'white',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#60A5FA' }}>
            Optical Eyepiece Field of View ({totalMagnification}x)
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: isInSharpFocus ? '#059669' : '#DC2626',
              color: 'white'
            }}
          >
            {isInSharpFocus ? '✓ Sharp Focus' : 'Blurry (Adjust Focus Knobs)'}
          </span>
        </div>

        {/* Circular Eyepiece Aperture */}
        <div
          style={{
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '6px solid #334155',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 10px 25px rgba(0,0,0,0.5)',
            position: 'relative',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Microscope Field Background with Illumination */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: selectedSpecimen.id === 'onion_peel' ? '#FEE2E2' : selectedSpecimen.id === 'cheek_cell' ? '#DBEAFE' : '#ECFDF5',
              opacity: lightIntensity / 100,
              filter: `blur(${blurPx}px)`,
              transition: 'filter 0.15s ease, opacity 0.2s ease',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* SVG Visual of Biological Specimen */}
            {selectedSpecimen.id === 'onion_peel' && (
              <svg viewBox="0 0 200 200" style={{ width: '90%', height: '90%', transform: `scale(${objectiveLens / 35})` }}>
                {/* Brick-like rectangular plant cells */}
                {[20, 60, 100, 140].map((y, rowIdx) => (
                  <g key={y}>
                    {[10, 70, 130].map((x, colIdx) => (
                      <g key={x}>
                        <rect
                          x={x + (rowIdx % 2 === 0 ? 0 : 25)}
                          y={y}
                          width="55"
                          height="35"
                          rx="3"
                          fill="#FECDD3"
                          stroke="#E11D48"
                          strokeWidth="2.5"
                        />
                        {/* Dense nucleus */}
                        <circle
                          cx={x + (rowIdx % 2 === 0 ? 0 : 25) + 38}
                          cy={y + 18}
                          r="5.5"
                          fill="#9F1239"
                        />
                        {/* Vacuole indication */}
                        <ellipse
                          cx={x + (rowIdx % 2 === 0 ? 0 : 25) + 20}
                          cy={y + 18}
                          rx="12"
                          ry="8"
                          fill="#FFE4E6"
                          stroke="#FDA4AF"
                          strokeWidth="1"
                        />
                      </g>
                    ))}
                  </g>
                ))}
              </svg>
            )}

            {selectedSpecimen.id === 'cheek_cell' && (
              <svg viewBox="0 0 200 200" style={{ width: '85%', height: '85%', transform: `scale(${objectiveLens / 35})` }}>
                {/* Irregular animal cells */}
                <path
                  d="M 60 70 C 40 90, 45 130, 75 140 C 115 150, 140 120, 135 90 C 130 60, 90 50, 60 70 Z"
                  fill="#BFDBFE"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                <circle cx="95" cy="100" r="7.5" fill="#1E3A8A" />

                <path
                  d="M 120 40 C 105 50, 110 75, 130 80 C 150 85, 170 70, 165 50 C 160 30, 135 25, 120 40 Z"
                  fill="#BFDBFE"
                  stroke="#2563EB"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <circle cx="140" cy="55" r="5" fill="#1E3A8A" />
              </svg>
            )}

            {selectedSpecimen.id === 'amoeba' && (
              <svg viewBox="0 0 200 200" style={{ width: '85%', height: '85%', transform: `scale(${objectiveLens / 35})` }}>
                {/* Amoeboid irregular pseudopodial shape */}
                <path
                  d="M 80 50 C 50 40, 30 70, 40 100 C 30 130, 60 160, 95 155 C 130 150, 160 170, 170 135 C 180 100, 150 85, 145 60 C 140 30, 105 55, 80 50 Z"
                  fill="#A7F3D0"
                  stroke="#059669"
                  strokeWidth="3"
                />
                <circle cx="105" cy="95" r="9" fill="#065F46" />
                <circle cx="70" cy="85" r="6" fill="#6EE7B7" stroke="#047857" strokeWidth="1.5" />
                <circle cx="135" cy="120" r="5" fill="#34D399" />
              </svg>
            )}
          </div>

          {/* Reticle / Crosshair Scale Overlay */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <circle cx="160" cy="160" r="158" fill="none" stroke="#475569" strokeWidth="2" />
            <line x1="160" y1="150" x2="160" y2="170" stroke="#94A3B8" strokeWidth="1" />
            <line x1="150" y1="160" x2="170" y2="160" stroke="#94A3B8" strokeWidth="1" />
          </svg>
        </div>

        {/* Status Callout */}
        <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center' }}>
          Specimen: <strong>{selectedSpecimen.name}</strong> • Stain: <strong>{selectedSpecimen.stain}</strong>
        </div>
      </div>

      {/* Right Column: Microscope Controls */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>
            Microscope Controls
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>
            Switch biological specimen slides, change objective lens magnification, and tune fine focus knobs.
          </p>
        </div>

        {/* Specimen Slide Selector */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>Select Biological Slide</label>
          <div style={{ display: 'grid', gap: '6px', marginTop: '6px' }}>
            {SPECIMENS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSpecimen(s);
                  setSelectedOrganelle(null);
                }}
                className={`btn ${selectedSpecimen.id === s.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.82rem' }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Objective Lens Turret */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>
            Objective Lens Turret (Total Magnification: {totalMagnification}x)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '6px' }}>
            {[10, 40, 100].map((mag) => (
              <button
                key={mag}
                onClick={() => setObjectiveLens(mag)}
                className={`btn ${objectiveLens === mag ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px', fontSize: '0.82rem' }}
              >
                {mag}x ({mag * 10}x Total)
              </button>
            ))}
          </div>
        </div>

        {/* Focus Knobs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Coarse Focus</span>
              <span>{coarseFocus}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={coarseFocus}
              onChange={(e) => setCoarseFocus(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Fine Focus</span>
              <span>{fineFocus}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={fineFocus}
              onChange={(e) => setFineFocus(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Substage Iris Diaphragm / Light Intensity */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sun size={14} /> Iris Diaphragm Aperture
            </span>
            <span>{lightIntensity}%</span>
          </label>
          <input
            type="range"
            min="30"
            max="100"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Organelle Key & Notes */}
        <div style={{ backgroundColor: 'var(--color-background)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px' }}>
            Distinct Visible Organelles:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedSpecimen.organelles.map((org, idx) => (
              <div key={idx} style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                <strong style={{ color: 'var(--color-primary)' }}>• {org.name}: </strong>
                <span style={{ color: 'var(--color-muted)' }}>{org.note}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '8px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <RotateCcw size={14} /> Reset Microscope to Initial Position
        </button>
      </div>
    </div>
  );
}

