'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface EarthProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

function Earth({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.01 }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Create more detailed Earth texture
  const earthTexture = useTexture({
    map: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="1024" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ocean" cx="50%" cy="30%">
            <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#1e3a8a;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#1e3a5f;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
          </radialGradient>
          <radialGradient id="land" cx="30%" cy="20%">
            <stop offset="0%" style="stop-color:#65a30d;stop-opacity:0.9" />
            <stop offset="50%" style="stop-color:#4d7c0f;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#365314;stop-opacity:0.7" />
          </radialGradient>
          <radialGradient id="desert" cx="40%" cy="30%">
            <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#d97706;stop-opacity:0.7" />
          </radialGradient>
          <radialGradient id="ice" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:0.8" />
          </radialGradient>
        </defs>
        <rect width="1024" height="512" fill="url(#ocean)"/>
        <!-- North America -->
        <ellipse cx="200" cy="120" rx="120" ry="80" fill="url(#land)"/>
        <ellipse cx="180" cy="100" rx="60" ry="40" fill="url(#desert)"/>
        <!-- Europe/Africa -->
        <ellipse cx="500" cy="150" rx="100" ry="120" fill="url(#land)"/>
        <ellipse cx="520" cy="200" rx="80" ry="100" fill="url(#desert)"/>
        <!-- Asia -->
        <ellipse cx="750" cy="100" rx="150" ry="90" fill="url(#land)"/>
        <ellipse cx="800" cy="80" rx="80" ry="50" fill="url(#desert)"/>
        <!-- Australia -->
        <ellipse cx="650" cy="350" rx="60" ry="40" fill="url(#land)"/>
        <!-- South America -->
        <ellipse cx="300" cy="300" rx="80" ry="120" fill="url(#land)"/>
        <ellipse cx="320" cy="350" rx="50" ry="80" fill="url(#desert)"/>
        <!-- Antarctica -->
        <ellipse cx="512" cy="480" rx="400" ry="30" fill="url(#ice)"/>
        <!-- Arctic -->
        <ellipse cx="512" cy="30" rx="400" ry="25" fill="url(#ice)"/>
        <!-- Cloud patterns -->
        <ellipse cx="300" cy="80" rx="40" ry="20" fill="#ffffff" opacity="0.3"/>
        <ellipse cx="600" cy="120" rx="50" ry="25" fill="#ffffff" opacity="0.3"/>
        <ellipse cx="800" cy="200" rx="45" ry="22" fill="#ffffff" opacity="0.3"/>
        <ellipse cx="400" cy="250" rx="35" ry="18" fill="#ffffff" opacity="0.3"/>
      </svg>
    `),
    normalMap: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="1024" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="normal" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color:#808080;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#404040;stop-opacity:1" />
          </radialGradient>
        </defs>
        <rect width="1024" height="512" fill="url(#normal)"/>
        <ellipse cx="200" cy="120" rx="120" ry="80" fill="#a0a0a0"/>
        <ellipse cx="500" cy="150" rx="100" ry="120" fill="#a0a0a0"/>
        <ellipse cx="750" cy="100" rx="150" ry="90" fill="#a0a0a0"/>
        <ellipse cx="650" cy="350" rx="60" ry="40" fill="#a0a0a0"/>
        <ellipse cx="300" cy="300" rx="80" ry="120" fill="#a0a0a0"/>
      </svg>
    `),
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * (hovered ? 2 : 1);
      meshRef.current.rotation.x += rotationSpeed * 0.1;
      
      // Add subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Sphere
      ref={meshRef}
      position={position}
      scale={scale * (clicked ? 1.2 : hovered ? 1.1 : 1)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <meshPhongMaterial
        map={earthTexture.map}
        normalMap={earthTexture.normalMap}
        shininess={100}
        specular={new THREE.Color(0x222222)}
        emissive={new THREE.Color(0x001122)}
        emissiveIntensity={hovered ? 0.1 : 0.05}
      />
    </Sphere>
  );
}

function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} scale={1.05}>
      <meshBasicMaterial
        color="#4a90e2"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}

function CloudLayer() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={meshRef} scale={1.01}>
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.2}
        side={THREE.FrontSide}
      />
    </Sphere>
  );
}

function Stars() {
  const pointsRef = useRef<THREE.Points>(null);
  const [points] = useState(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.01}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export default function Earth3D({ 
  position = [0, 0, 0], 
  scale = 1, 
  rotationSpeed = 0.01 
}: EarthProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4a90e2" />
        <pointLight position={[0, 0, 10]} intensity={0.5} color="#ffffff" />
        
        <Earth position={position} scale={scale} rotationSpeed={rotationSpeed} />
        <Atmosphere />
        <CloudLayer />
        <Stars />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* Earth info overlay */}
      <div className="absolute bottom-4 left-4 text-white text-sm opacity-80">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="font-semibold">Earth</div>
          <div className="text-xs opacity-70">Interactive 3D Model</div>
        </div>
      </div>
    </div>
  );
}
