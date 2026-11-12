import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Heart, Activity, Play, Pause, ChevronRight, ChevronLeft, Info } from 'lucide-react';

const BLOOD_FLOW_STEPS = [
  {
    step: 1,
    title: '1. Vena Cava Collects Blood',
    chamber: 'Vena Cava',
    type: 'deox',
    text: 'Superior and Inferior Vena Cava return oxygen-poor, CO₂-rich blood from all body tissues into the Right Atrium.'
  },
  {
    step: 2,
    title: '2. Right Atrium Contracts',
    chamber: 'Right Atrium',
    type: 'deox',
    text: 'Right Atrium fills and contracts (atrial systole), pumping blood through the Tricuspid Valve into the Right Ventricle.'
  },
  {
    step: 3,
    title: '3. Right Ventricle Pumps to Lungs',
    chamber: 'Right Ventricle',
    type: 'deox',
    text: 'Right Ventricle contracts forcefully, pumping deoxygenated blood through the Pulmonary Artery towards the lungs for oxygenation.'
  },
  {
    step: 4,
    title: '4. Pulmonary Veins to Left Atrium',
    chamber: 'Left Atrium',
    type: 'ox',
    text: 'Oxygen-rich blood returns from alveolar capillaries through 4 Pulmonary Veins into the Left Atrium.'
  },
  {
    step: 5,
    title: '5. Left Ventricle Pumps to Body',
    chamber: 'Left Ventricle',
    type: 'ox',
    text: 'Left Ventricle (thickest muscular chamber) contracts, pumping oxygenated blood at 120 mm Hg through the Aorta to all organs.'
  }
];

export default function HeartCirculationSimulation() {
  const mountRef = useRef(null);
  const [bpm, setBpm] = useState(72);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);

  const step = BLOOD_FLOW_STEPS[currentStepIdx];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 340;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F172A);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    dirLight.position.set(4, 6, 6);
    scene.add(dirLight);

    const heartGroup = new THREE.Group();
    scene.add(heartGroup);

    // Materials: Red = Oxygenated, Blue = Deoxygenated
    const oxMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.35, metalness: 0.1 });
    const deoxMat = new THREE.MeshStandardMaterial({ color: 0x2563EB, roughness: 0.35, metalness: 0.1 });
    const aortaMat = new THREE.MeshStandardMaterial({ color: 0x991B1B, roughness: 0.4 });
    const vesselMat = new THREE.MeshStandardMaterial({ color: 0x1E40AF, roughness: 0.4 });

    // 1. Left Ventricle (Thick muscular base, Red)
    const lvGeo = new THREE.SphereGeometry(1.0, 32, 32);
    lvGeo.scale(0.85, 1.3, 0.85);
    const leftVentricle = new THREE.Mesh(lvGeo, oxMat);
    leftVentricle.position.set(0.6, -0.4, 0);
    heartGroup.add(leftVentricle);

    // 2. Right Ventricle (Base, Blue)
    const rvGeo = new THREE.SphereGeometry(0.9, 32, 32);
    rvGeo.scale(0.85, 1.2, 0.85);
    const rightVentricle = new THREE.Mesh(rvGeo, deoxMat);
    rightVentricle.position.set(-0.6, -0.4, 0);
    heartGroup.add(rightVentricle);

    // 3. Left Atrium (Top right from front, Red)
    const laGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const leftAtrium = new THREE.Mesh(laGeo, oxMat);
    leftAtrium.position.set(0.65, 0.9, 0);
    heartGroup.add(leftAtrium);

    // 4. Right Atrium (Top left from front, Blue)
    const raGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const rightAtrium = new THREE.Mesh(raGeo, deoxMat);
    rightAtrium.position.set(-0.65, 0.9, 0);
    heartGroup.add(rightAtrium);

    // 5. Aorta Arch (Top curving tube)
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.3, 1.2, 0),
      new THREE.Vector3(0.0, 2.2, 0),
      new THREE.Vector3(-0.9, 1.4, -0.3)
    );
    const aortaGeo = new THREE.TubeGeometry(curve, 20, 0.28, 16, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    heartGroup.add(aortaMesh);

    // 6. Vena Cava (Vertical tube, Blue)
    const vcGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.2, 16);
    const vcMesh = new THREE.Mesh(vcGeo, vesselMat);
    vcMesh.position.set(-1.1, 0.8, -0.2);
    heartGroup.add(vcMesh);

    // Drag Orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      heartGroup.rotation.y += (e.clientX - prevX) * 0.01;
      heartGroup.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Cardiac Animation Pulse
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Pulse frequency based on BPM
      const freq = (bpm / 60) * 2 * Math.PI;
      const pulse = 1.0 + 0.06 * Math.sin(elapsed * freq);

      leftVentricle.scale.set(0.85 * pulse, 1.3 * pulse, 0.85 * pulse);
      rightVentricle.scale.set(0.85 * pulse, 1.2 * pulse, 0.85 * pulse);

      if (!isDragging) {
        heartGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      scene.clear();
    };
  }, [bpm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 3D Viewport */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div ref={mountRef} style={{ width: '100%', height: '340px', cursor: 'grab' }} />

        {/* BPM Pulse Readout */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="#EF4444" className="animate-pulse" />
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#FFFFFF' }}>{bpm} BPM</span>
        </div>

        {/* Oxygenation Legend */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#DC2626' }} /> Oxygenated (Red)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#2563EB' }} /> Deoxygenated (Blue)
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', color: '#CBD5E1' }}>
          Drag to rotate heart
        </div>
      </div>

      {/* Heartbeat Speed Slider */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
          <span>Cardiac Heartbeat Rate (BPM)</span>
          <span style={{ color: '#DC2626' }}>{bpm} Beats / min</span>
        </div>
        <input
          type="range"
          min={40}
          max={150}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#DC2626' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
          <span>Resting (50)</span>
          <span>Normal (72)</span>
          <span>Exercising (130+)</span>
        </div>
      </div>

      {/* Step-by-Step Blood Circulation Walkthrough */}
      <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: step.type === 'ox' ? '#DC2626' : '#2563EB' }}>
            <Heart size={16} /> DOUBLE CIRCULATION WALKTHROUGH
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              disabled={currentStepIdx === 0}
              onClick={() => setCurrentStepIdx(prev => prev - 1)}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', cursor: currentStepIdx === 0 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentStepIdx === BLOOD_FLOW_STEPS.length - 1}
              onClick={() => setCurrentStepIdx(prev => prev + 1)}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', cursor: currentStepIdx === BLOOD_FLOW_STEPS.length - 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '800', color: '#1E293B' }}>{step.title}</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>{step.text}</p>
      </div>
    </div>
  );
}
