import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Shield } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const ThreeWatchStudio: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const watchGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Main Studio Key Light (Champagne Gold / Warm White)
    const keyLight = new THREE.DirectionalLight(0xfff3d6, 3.5);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    // Rim / Backlight (Cool Steel Blue)
    const rimLight = new THREE.DirectionalLight(0x7ec8e3, 2.5);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // Top Specular Point Light (Gold reflection)
    const topLight = new THREE.PointLight(0xdfb15b, 2, 20);
    topLight.position.set(0, 4, 3);
    scene.add(topLight);

    // Build Procedural 3D Luxury Watch Geometry
    const watchGroup = new THREE.Group();
    watchGroupRef.current = watchGroup;

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6dbe1,
      metalness: 0.95,
      roughness: 0.18,
      wireframe: wireframeMode,
    });

    const bezelCeramic = new THREE.MeshStandardMaterial({
      color: 0x12161f,
      metalness: 0.85,
      roughness: 0.1,
      wireframe: wireframeMode,
    });

    const dialMaterial = new THREE.MeshStandardMaterial({
      color: 0x080b11,
      metalness: 0.4,
      roughness: 0.35,
      wireframe: wireframeMode,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb15b,
      metalness: 0.95,
      roughness: 0.2,
      wireframe: wireframeMode,
    });

    const sapphireGlass = new THREE.MeshPhysicalMaterial({
      color: 0xdff4ff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.88,
      thickness: 0.6,
      transparent: true,
      opacity: 0.35,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const leatherMaterial = new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: wireframeMode,
    });

    // 1. Case (Outer Cylinder + Chamfers)
    const caseGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.45, 64);
    caseGeo.rotateX(Math.PI / 2);
    const caseMesh = new THREE.Mesh(caseGeo, steelMaterial);
    watchGroup.add(caseMesh);

    // 2. Bezel Ring
    const bezelGeo = new THREE.TorusGeometry(2.05, 0.14, 32, 100);
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelCeramic);
    bezelMesh.position.z = 0.22;
    watchGroup.add(bezelMesh);

    // Bezel Gold Outer Trim Ring
    const goldTrimGeo = new THREE.TorusGeometry(2.16, 0.035, 24, 100);
    const goldTrim = new THREE.Mesh(goldTrimGeo, goldMaterial);
    goldTrim.position.z = 0.22;
    watchGroup.add(goldTrim);

    // 3. Dial Face
    const dialGeo = new THREE.CircleGeometry(1.95, 64);
    const dialMesh = new THREE.Mesh(dialGeo, dialMaterial);
    dialMesh.position.z = 0.21;
    watchGroup.add(dialMesh);

    // Dial Indices (12 Hour Markers)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const isQuarter = i % 3 === 0;
      const markerGeo = new THREE.BoxGeometry(isQuarter ? 0.08 : 0.04, isQuarter ? 0.28 : 0.18, 0.04);
      const marker = new THREE.Mesh(markerGeo, goldMaterial);
      marker.position.x = Math.sin(angle) * 1.65;
      marker.position.y = Math.cos(angle) * 1.65;
      marker.position.z = 0.23;
      marker.rotation.z = -angle;
      watchGroup.add(marker);
    }

    // 3 Subdials for Chronograph
    const subdialPositions = [
      { x: 0, y: 0.75, r: 0.45 },
      { x: -0.75, y: -0.2, r: 0.42 },
      { x: 0.75, y: -0.2, r: 0.42 },
    ];
    subdialPositions.forEach((pos) => {
      const subdialGeo = new THREE.RingGeometry(pos.r - 0.02, pos.r, 32);
      const subdial = new THREE.Mesh(subdialGeo, goldMaterial);
      subdial.position.set(pos.x, pos.y, 0.225);
      watchGroup.add(subdial);
    });

    // 4. Watch Hands (Hour, Minute, Chrono Seconds)
    const hourHandGeo = new THREE.BoxGeometry(0.09, 1.1, 0.03);
    hourHandGeo.translate(0, 0.45, 0);
    const hourHand = new THREE.Mesh(hourHandGeo, goldMaterial);
    hourHand.position.z = 0.25;
    hourHand.rotation.z = -0.6; // 10:10 classic aesthetic time
    watchGroup.add(hourHand);

    const minuteHandGeo = new THREE.BoxGeometry(0.06, 1.55, 0.03);
    minuteHandGeo.translate(0, 0.65, 0);
    const minuteHand = new THREE.Mesh(minuteHandGeo, steelMaterial);
    minuteHand.position.z = 0.26;
    minuteHand.rotation.z = 0.75;
    watchGroup.add(minuteHand);

    const secondHandGeo = new THREE.BoxGeometry(0.02, 1.75, 0.02);
    secondHandGeo.translate(0, 0.6, 0);
    const secondHand = new THREE.Mesh(secondHandGeo, goldMaterial);
    secondHand.position.z = 0.27;
    secondHand.rotation.z = 2.1;
    watchGroup.add(secondHand);

    // Center Pin
    const pinGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 32);
    pinGeo.rotateX(Math.PI / 2);
    const pin = new THREE.Mesh(pinGeo, goldMaterial);
    pin.position.z = 0.28;
    watchGroup.add(pin);

    // 5. Crown & Chronograph Pushers (Right side)
    const crownGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 32);
    crownGeo.rotateZ(Math.PI / 2);
    const crown = new THREE.Mesh(crownGeo, goldMaterial);
    crown.position.set(2.25, 0, 0);
    watchGroup.add(crown);

    const pusherTopGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.3, 24);
    pusherTopGeo.rotateZ(Math.PI / 2);
    const pusherTop = new THREE.Mesh(pusherTopGeo, steelMaterial);
    pusherTop.position.set(2.1, 1.1, 0);
    watchGroup.add(pusherTop);

    const pusherBottom = new THREE.Mesh(pusherTopGeo, steelMaterial);
    pusherBottom.position.set(2.1, -1.1, 0);
    watchGroup.add(pusherBottom);

    // 6. Straps (Top and Bottom)
    const strapTopGeo = new THREE.BoxGeometry(1.65, 2.8, 0.2);
    strapTopGeo.translate(0, 2.5, -0.1);
    const strapTop = new THREE.Mesh(strapTopGeo, leatherMaterial);
    watchGroup.add(strapTop);

    const strapBottomGeo = new THREE.BoxGeometry(1.65, 2.8, 0.2);
    strapBottomGeo.translate(0, -2.5, -0.1);
    const strapBottom = new THREE.Mesh(strapBottomGeo, leatherMaterial);
    watchGroup.add(strapBottom);

    // 7. Domed Sapphire Glass
    const glassGeo = new THREE.CylinderGeometry(2.02, 2.02, 0.15, 64);
    glassGeo.rotateX(Math.PI / 2);
    const glass = new THREE.Mesh(glassGeo, sapphireGlass);
    glass.position.z = 0.32;
    watchGroup.add(glass);

    // Initial slight angle
    watchGroup.rotation.x = 0.25;
    watchGroup.rotation.y = -0.3;
    scene.add(watchGroup);

    // Mouse Drag Interaction handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !watchGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      watchGroupRef.current.rotation.y += deltaX * 0.008;
      watchGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotating && !isDraggingRef.current && watchGroupRef.current) {
        watchGroupRef.current.rotation.y += delta * 0.3;
      }

      // Subtle second hand rotation
      if (secondHand) {
        secondHand.rotation.z -= delta * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, wireframeMode]);

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-radial-spotlight border border-chronova-border">
      
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Floating 3D Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => {
            audioEngine.playHapticClick();
            setIsRotating(!isRotating);
          }}
          className={`p-2.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 backdrop-blur-md ${
            isRotating 
              ? 'bg-chronova-gold/20 border-chronova-gold/50 text-chronova-gold shadow-gold-glow' 
              : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'
          }`}
          title={isRotating ? "Pause 360° Auto-Rotation" : "Start 360° Auto-Rotation"}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
          <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">
            {isRotating ? '360° Rotating' : 'Rotate Paused'}
          </span>
        </button>

        <button
          onClick={() => {
            audioEngine.playHapticClick();
            setWireframeMode(!wireframeMode);
          }}
          className={`p-2.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 backdrop-blur-md ${
            wireframeMode 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
              : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Toggle CAD Wireframe Mesh"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">
            {wireframeMode ? 'CAD Wireframe' : 'Solid Render'}
          </span>
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none text-[10px] uppercase tracking-widest text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-chronova-gold animate-pulse"></span>
          Drag cursor to rotate 3D model
        </span>
        <span className="text-chronova-gold/90 font-semibold">
          WebGL 2.0 Engine · 60 FPS
        </span>
      </div>

    </div>
  );
};
