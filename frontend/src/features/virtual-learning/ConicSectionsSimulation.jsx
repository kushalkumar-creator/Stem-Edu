import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sliders, HelpCircle } from 'lucide-react';

export default function ConicSectionsSimulation() {
  const mountRef = useRef(null);
  const [planeAngle, setPlaneAngle] = useState(90); // beta in degrees: 15 to 90
  const [planeHeight, setPlaneHeight] = useState(0.8); // translation along axis

  const alpha = 45; // cone semi-vertical angle in degrees

  // Conic classification
  let conicType = '';
  let eccentricity = '';
  let equation = '';
  let color = '#2563EB';

  if (planeAngle >= 88) {
    conicType = 'Circle (वृत्त)';
    eccentricity = 'e = 0';
    equation = 'x² + y² = r²';
    color = '#2563EB';
  } else if (planeAngle > 46) {
    conicType = 'Ellipse (दीर्घवृत्त)';
    eccentricity = '0 < e < 1';
    equation = 'x²/a² + y²/b² = 1';
    color = '#16A34A';
  } else if (planeAngle >= 44 && planeAngle <= 46) {
    conicType = 'Parabola (परवलय)';
    eccentricity = 'e = 1';
    equation = 'y² = 4ax';
    color = '#EA580C';
  } else {
    conicType = 'Hyperbola (अतिपरवलय)';
    eccentricity = 'e > 1';
    equation = 'x²/a² - y²/b² = 1';
    color = '#DC2626';
  }

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 340;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F172A);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xFFFFFF, 0.7));
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Upper Cone (Vertex at origin, opening upward)
    const coneRadius = 2.0;
    const coneHeight = 2.0;
    const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 36, 1, true);

    const coneMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      wireframe: false
    });

    const upperCone = new THREE.Mesh(coneGeo, coneMat);
    upperCone.position.y = coneHeight / 2;
    group.add(upperCone);

    // Wireframe overlay for cone
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x0284C7, wireframe: true, transparent: true, opacity: 0.25 });
    const upperWire = new THREE.Mesh(coneGeo, wireMat);
    upperWire.position.y = coneHeight / 2;
    group.add(upperWire);

    // 2. Lower Cone (Vertex at origin, opening downward)
    const lowerCone = new THREE.Mesh(coneGeo, coneMat);
    lowerCone.rotation.x = Math.PI;
    lowerCone.position.y = -coneHeight / 2;
    group.add(lowerCone);

    const lowerWire = new THREE.Mesh(coneGeo, wireMat);
    lowerWire.rotation.x = Math.PI;
    lowerWire.position.y = -coneHeight / 2;
    group.add(lowerWire);

    // 3. Central Axis (Z-axis / Cone axis)
    const axisGeo = new THREE.CylinderGeometry(0.02, 0.02, 5, 8);
    const axisMat = new THREE.MeshBasicMaterial({ color: 0x94A3B8 });
    const axisMesh = new THREE.Mesh(axisGeo, axisMat);
    group.add(axisMesh);

    // 4. Cutting Plane
    const planeGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const cuttingPlane = new THREE.Mesh(planeGeo, planeMat);

    // Plane rotation: beta angle from axis
    // beta = 90 deg -> horizontal (rotation.x = Math.PI / 2)
    // beta = 45 deg -> 45 tilt
    const radBeta = (planeAngle * Math.PI) / 180;
    cuttingPlane.rotation.x = Math.PI / 2 - (Math.PI / 2 - radBeta);
    cuttingPlane.position.set(0, planeHeight, 0);
    group.add(cuttingPlane);

    // Mouse Drag Rotation
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
      group.rotation.y += (e.clientX - prevX) * 0.01;
      group.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.005;
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
  }, [planeAngle, planeHeight]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 3D Viewport */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div ref={mountRef} style={{ width: '100%', height: '340px', cursor: 'grab' }} />

        {/* Live Identification Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '8px 14px', borderRadius: '8px', border: `2px solid ${color}`, backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>INTERSECTION CONIC SECTION</div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF' }}>{conicType}</div>
        </div>

        <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', color: '#CBD5E1' }}>
          Drag to orbit 3D view
        </div>
      </div>

      {/* Angle & Position Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
            <span>Cutting Plane Angle (β)</span>
            <span style={{ color }}>{planeAngle}°</span>
          </div>
          <input
            type="range"
            min={15}
            max={90}
            value={planeAngle}
            onChange={(e) => setPlaneAngle(Number(e.target.value))}
            style={{ width: '100%', accentColor: color }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>
            <span>Hyperbola (15°)</span>
            <span>Parabola (45°)</span>
            <span>Circle (90°)</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
            <span>Plane Height Offset</span>
            <span style={{ color: '#475569' }}>{planeHeight}</span>
          </div>
          <input
            type="range"
            min={-1.2}
            max={1.5}
            step={0.1}
            value={planeHeight}
            onChange={(e) => setPlaneHeight(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#475569' }}
          />
        </div>
      </div>

      {/* Mathematical Readouts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700' }}>Eccentricity</div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color }}>{eccentricity}</div>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700' }}>Standard Equation</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1E293B' }}>{equation}</div>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700' }}>Semi-Vertical Angle (α)</div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#475569' }}>45°</div>
        </div>
      </div>
    </div>
  );
}

