import React, { useState, useEffect, useRef } from 'react';
import { Layers, Search, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

/**
 * Skeleton & Muscles Simulation (P2-8.2)
 * CBSE Class 11 & 12 Biology (Locomotion and Movement):
 * - Human Skeletal & Muscular Framework: 13 key anatomical landmarks.
 * - Antagonistic Muscle Pair Mechanism: Flexion vs Extension at the elbow joint (Biceps brachii contract while Triceps brachii relax, and vice versa).
 * - Layer Toggles: Skeleton only, Muscles only, or Composite anatomy.
 */
export default function SkeletonMusclesSimulation() {
  const [layer, setLayer] = useState('both'); // 'skeleton' | 'muscles' | 'both'
  const [elbowAngle, setElbowAngle] = useState(90); // 30 deg (full flexion) to 170 deg (full extension)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);

  const canvasRef = useRef(null);

  // 13 Anatomical Landmarks (P2-8.2.1)
  const anatomicalParts = [
    { id: 'biceps', name: 'Biceps Brachii', type: 'muscle', role: 'Primary elbow flexor (antagonistic pair)' },
    { id: 'triceps', name: 'Triceps Brachii', type: 'muscle', role: 'Primary elbow extensor (relaxes on flexion)' },
    { id: 'humerus', name: 'Humerus', type: 'bone', role: 'Long bone of the upper arm' },
    { id: 'radius', name: 'Radius', type: 'bone', role: 'Lateral bone of the forearm (rotates for pronation)' },
    { id: 'ulna', name: 'Ulna', type: 'bone', role: 'Medial bone of the forearm forming the elbow hinge' },
    { id: 'deltoid', name: 'Deltoid Muscle', type: 'muscle', role: 'Abducts the arm at shoulder joint' },
    { id: 'pectoralis', name: 'Pectoralis Major', type: 'muscle', role: 'Chest muscle pulling arm across thorax' },
    { id: 'femur', name: 'Femur', type: 'bone', role: 'Longest, strongest bone in human body' },
    { id: 'patella', name: 'Patella (Kneecap)', type: 'bone', role: 'Sesamoid bone protecting the knee joint' },
    { id: 'tibia', name: 'Tibia (Shinbone)', type: 'bone', role: 'Major weight-bearing bone of the lower leg' },
    { id: 'quadriceps', name: 'Quadriceps Femoris', type: 'muscle', role: 'Extends leg at knee joint' },
    { id: 'gastrocnemius', name: 'Gastrocnemius (Calf)', type: 'muscle', role: 'Plantarflexes foot during walking' },
    { id: 'cranium', name: 'Cranium (Skull)', type: 'bone', role: 'Encases and protects brain with suture joints' }
  ];

  const filteredParts = searchQuery.trim()
    ? anatomicalParts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : anatomicalParts;

  // Canvas drawing for Elbow Antagonistic Flexion / Extension
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Shoulder anchor point
    const shoulderX = 140;
    const shoulderY = 80;

    // Elbow joint position (Humerus length = 110px)
    const humerusLen = 110;
    const elbowX = shoulderX;
    const elbowY = shoulderY + humerusLen;

    // Forearm (Radius/Ulna) length = 120px
    const forearmLen = 120;
    // Calculate hand position based on elbowAngle (in radians)
    // 0 deg = down, 90 deg = horizontal, 150 deg = curled up
    const rad = ((180 - elbowAngle) * Math.PI) / 180;
    const handX = elbowX + forearmLen * Math.sin(rad);
    const handY = elbowY - forearmLen * Math.cos(rad);

    // 1. Draw Skeleton Layer (Bones)
    if (layer === 'skeleton' || layer === 'both') {
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#E2E8F0';

      // Humerus
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(elbowX, elbowY);
      ctx.stroke();

      // Forearm (Radius + Ulna)
      ctx.beginPath();
      ctx.moveTo(elbowX, elbowY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      // Bone highlights / outlines
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#94A3B8';
      ctx.strokeRect(shoulderX - 8, shoulderY - 8, 16, 16); // Shoulder joint

      // Elbow Hinge Joint (condyle)
      ctx.beginPath();
      ctx.arc(elbowX, elbowY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#CBD5E1';
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Humerus (Upper arm)', shoulderX - 110, (shoulderY + elbowY) / 2);
      ctx.fillText('Elbow Hinge Joint', elbowX + 16, elbowY + 4);
      ctx.fillText('Radius & Ulna', (elbowX + handX) / 2 + 10, (elbowY + handY) / 2 + 16);
    }

    // 2. Draw Muscle Layer (Antagonistic Biceps & Triceps)
    if (layer === 'muscles' || layer === 'both') {
      const isFlexed = elbowAngle < 90;
      const bicepsBellyWidth = 14 + (180 - elbowAngle) * 0.12; // bulges during flexion
      const tricepsBellyWidth = 12 + (elbowAngle) * 0.08; // stretches during extension

      // Biceps Brachii (Anterior / Front)
      const bMidX = (shoulderX + handX) / 2 - 15;
      const bMidY = (shoulderY + handY) / 2 - 10;

      ctx.beginPath();
      ctx.moveTo(shoulderX - 4, shoulderY + 15);
      ctx.quadraticCurveTo(shoulderX + 25 + bicepsBellyWidth, (shoulderY + elbowY) / 2, elbowX + 15, elbowY - 10);
      ctx.lineWidth = bicepsBellyWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isFlexed ? '#EF4444' : '#F87171';
      ctx.stroke();

      // Triceps Brachii (Posterior / Back)
      ctx.beginPath();
      ctx.moveTo(shoulderX - 12, shoulderY + 20);
      ctx.quadraticCurveTo(shoulderX - 25 - tricepsBellyWidth, (shoulderY + elbowY) / 2, elbowX - 8, elbowY + 8);
      ctx.lineWidth = tricepsBellyWidth;
      ctx.strokeStyle = !isFlexed ? '#3B82F6' : '#93C5FD';
      ctx.stroke();

      // Muscle Status Callouts
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#DC2626';
      ctx.fillText(
        `Biceps: ${isFlexed ? 'CONTRACTED (Shortened & Bulging)' : 'RELAXED (Stretched)'}`,
        shoulderX + 50,
        shoulderY + 50
      );

      ctx.fillStyle = '#2563EB';
      ctx.fillText(
        `Triceps: ${!isFlexed ? 'CONTRACTED (Pulling Arm Straight)' : 'RELAXED (Elongated)'}`,
        shoulderX - 180,
        shoulderY + 110
      );
    }

    // Angle indicator
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Joint Angle: ${elbowAngle}° (${elbowAngle < 90 ? 'Flexion' : 'Extension'})`, 20, 25);
  }, [layer, elbowAngle]);

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Layer Toggles & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
          {[
            { id: 'both', label: 'Composite (Both)' },
            { id: 'muscles', label: 'Muscles Only' },
            { id: 'skeleton', label: 'Skeleton Only' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setLayer(t.id)}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: layer === t.id ? '#4F46E5' : 'transparent',
                color: layer === t.id ? '#FFFFFF' : '#64748B'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', padding: '4px 10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
          <Search size={14} color="#64748B" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bone or muscle..."
            style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.78rem', width: '150px' }}
          />
        </div>
      </div>

      {/* Main Viewport & Anatomical List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '14px' }}>
        <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', height: '300px', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={480}
            height={300}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>

        {/* 13 Landmark Explorer List */}
        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
            CBSE Anatomy Landmarks ({filteredParts.length})
          </div>
          {filteredParts.map(part => (
            <button
              key={part.id}
              type="button"
              onClick={() => setSelectedPart(part)}
              style={{
                textAlign: 'left',
                padding: '8px 10px',
                borderRadius: '8px',
                border: selectedPart?.id === part.id ? '1px solid #4F46E5' : '1px solid #E2E8F0',
                backgroundColor: selectedPart?.id === part.id ? '#EEF2FF' : '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B' }}>{part.name}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: '700', padding: '1px 5px', borderRadius: '4px', backgroundColor: part.type === 'muscle' ? '#FEE2E2' : '#F1F5F9', color: part.type === 'muscle' ? '#991B1B' : '#475569' }}>
                  {part.type}
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px' }}>{part.role}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Elbow Joint Angle Slider */}
      <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px' }}>
          <span>Elbow Joint Movement (Flexion vs Extension):</span>
          <span style={{ color: '#4F46E5' }}>{elbowAngle}° ({elbowAngle < 90 ? 'Flexion (Arm bent)' : 'Extension (Arm straight)'})</span>
        </div>
        <input
          type="range"
          min="40"
          max="160"
          step="2"
          value={elbowAngle}
          onChange={(e) => setElbowAngle(parseInt(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748B', marginTop: '4px' }}>
          <span>← Full Flexion (Biceps shorten)</span>
          <span>Full Extension (Triceps shorten) →</span>
        </div>
      </div>
    </div>
  );
}
