import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3D, Play, Pause, Info } from 'lucide-react';

const MOLECULES = {
  methane: {
    name: 'Methane (CH₄)',
    geometry: 'Tetrahedral',
    hybridization: 'sp³',
    angle: '109.5°',
    description: '4 single C-H covalent bonds forming a symmetric regular tetrahedron.',
    atoms: [
      { element: 'C', pos: [0, 0, 0] },
      { element: 'H', pos: [1.2, 1.2, 1.2] },
      { element: 'H', pos: [-1.2, -1.2, 1.2] },
      { element: 'H', pos: [-1.2, 1.2, -1.2] },
      { element: 'H', pos: [1.2, -1.2, -1.2] }
    ],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
  },
  water: {
    name: 'Water (H₂O)',
    geometry: 'Bent / V-Shaped',
    hybridization: 'sp³ (2 lone pairs)',
    angle: '104.5°',
    description: 'Lone pair repulsions compress the H-O-H bond angle from 109.5° down to 104.5°.',
    atoms: [
      { element: 'O', pos: [0, 0, 0] },
      { element: 'H', pos: [1.3, 0.9, 0] },
      { element: 'H', pos: [-1.3, 0.9, 0] }
    ],
    bonds: [[0, 1], [0, 2]]
  },
  ammonia: {
    name: 'Ammonia (NH₃)',
    geometry: 'Trigonal Pyramidal',
    hybridization: 'sp³ (1 lone pair)',
    angle: '107°',
    description: 'Central Nitrogen with 3 bond pairs and 1 lone pair at the apex.',
    atoms: [
      { element: 'N', pos: [0, 0.4, 0] },
      { element: 'H', pos: [1.2, -0.4, 0.7] },
      { element: 'H', pos: [-1.2, -0.4, 0.7] },
      { element: 'H', pos: [0, -0.4, -1.4] }
    ],
    bonds: [[0, 1], [0, 2], [0, 3]]
  },
  carbon_dioxide: {
    name: 'Carbon Dioxide (CO₂)',
    geometry: 'Linear',
    hybridization: 'sp',
    angle: '180°',
    description: 'Linear molecule with two C=O double bonds and zero net dipole moment.',
    atoms: [
      { element: 'C', pos: [0, 0, 0] },
      { element: 'O', pos: [1.8, 0, 0] },
      { element: 'O', pos: [-1.8, 0, 0] }
    ],
    bonds: [[0, 1], [0, 2]]
  },
  benzene: {
    name: 'Benzene (C₆H₆)',
    geometry: 'Planar Hexagonal',
    hybridization: 'sp² (Aromatic ring)',
    angle: '120°',
    description: 'Planar cyclic ring with 6 delocalized π-electrons and uniform bond lengths.',
    atoms: [
      // 6 Carbons
      { element: 'C', pos: [1.8, 0, 0] },
      { element: 'C', pos: [0.9, 1.56, 0] },
      { element: 'C', pos: [-0.9, 1.56, 0] },
      { element: 'C', pos: [-1.8, 0, 0] },
      { element: 'C', pos: [-0.9, -1.56, 0] },
      { element: 'C', pos: [0.9, -1.56, 0] },
      // 6 Hydrogens
      { element: 'H', pos: [2.8, 0, 0] },
      { element: 'H', pos: [1.4, 2.42, 0] },
      { element: 'H', pos: [-1.4, 2.42, 0] },
      { element: 'H', pos: [-2.8, 0, 0] },
      { element: 'H', pos: [-1.4, -2.42, 0] },
      { element: 'H', pos: [1.4, -2.42, 0] }
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]
    ]
  }
};

const ATOM_CONFIG = {
  H: { color: 0xF4F4F5, radius: 0.35, label: 'Hydrogen' },
  C: { color: 0x334155, radius: 0.55, label: 'Carbon' },
  N: { color: 0x2563EB, radius: 0.52, label: 'Nitrogen' },
  O: { color: 0xDC2626, radius: 0.50, label: 'Oxygen' }
};

export default function MoleculeViewerSimulation() {
  const mountRef = useRef(null);
  const [selectedKey, setSelectedKey] = useState('methane');
  const [autoRotate, setAutoRotate] = useState(true);

  const molData = MOLECULES[selectedKey] || MOLECULES.methane;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 340;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F172A);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x93C5FD, 0.6);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // 3. Molecule Group
    const molGroup = new THREE.Group();
    scene.add(molGroup);

    // Build Atoms
    const sphereGeoCache = {};
    const atomMeshes = [];

    molData.atoms.forEach((atom) => {
      const cfg = ATOM_CONFIG[atom.element] || ATOM_CONFIG.H;
      if (!sphereGeoCache[cfg.radius]) {
        sphereGeoCache[cfg.radius] = new THREE.SphereGeometry(cfg.radius, 32, 32);
      }
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.3,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(sphereGeoCache[cfg.radius], mat);
      mesh.position.set(...atom.pos);
      molGroup.add(mesh);
      atomMeshes.push(mesh);
    });

    // Build Bonds
    const bondMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.4 });
    molData.bonds.forEach(([idxA, idxB]) => {
      const posA = new THREE.Vector3(...molData.atoms[idxA].pos);
      const posB = new THREE.Vector3(...molData.atoms[idxB].pos);
      const dist = posA.distanceTo(posB);

      const bondGeo = new THREE.CylinderGeometry(0.12, 0.12, dist, 16);
      const bondMesh = new THREE.Mesh(bondGeo, bondMat);

      // Position halfway between atoms
      bondMesh.position.copy(posA).add(posB).multiplyScalar(0.5);

      // Orient cylinder towards posB
      const dir = new THREE.Vector3().subVectors(posB, posA).normalize();
      const axis = new THREE.Vector3(0, 1, 0);
      bondMesh.quaternion.setFromUnitVectors(axis, dir);

      molGroup.add(bondMesh);
    });

    // 4. Mouse Drag Orbit Handling
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      molGroup.rotation.y += deltaX * 0.01;
      molGroup.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 5. Render Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        molGroup.rotation.y += 0.01;
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
  }, [selectedKey, autoRotate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Molecule Switcher Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {Object.entries(MOLECULES).map(([key, m]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedKey(key)}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: '700',
              borderRadius: '8px',
              border: selectedKey === key ? '2px solid #3B82F6' : '1px solid #CBD5E1',
              backgroundColor: selectedKey === key ? '#EFF6FF' : '#FFFFFF',
              color: selectedKey === key ? '#1D4ED8' : '#475569',
              cursor: 'pointer'
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* 3D Canvas Viewport */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div ref={mountRef} style={{ width: '100%', height: '340px', cursor: 'grab' }} />

        {/* Orbit / Rotate Overlay Controls */}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {autoRotate ? <Pause size={14} /> : <Play size={14} />} {autoRotate ? 'Pause Orbit' : 'Rotate'}
          </button>
        </div>

        {/* Element Legend Overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '10px', backgroundColor: 'rgba(15, 23, 42, 0.75)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#E2E8F0' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#334155', border: '1px solid #94A3B8' }} /> C
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#E2E8F0' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} /> H
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#E2E8F0' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#DC2626' }} /> O
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#E2E8F0' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563EB' }} /> N
          </div>
        </div>
      </div>

      {/* VSEPR Geometry Data Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700' }}>VSEPR Geometry</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1E293B' }}>{molData.geometry}</div>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700' }}>Hybridization</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#2563EB' }}>{molData.hybridization}</div>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700' }}>Bond Angle</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#16A34A' }}>{molData.angle}</div>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, backgroundColor: '#EFF6FF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
        💡 <strong>CBSE Concept:</strong> {molData.description}
      </p>
    </div>
  );
}

