import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { BuildingTwin } from './BuildingTwin';
import { 
  Layers, 
  Thermometer, 
  Users, 
  Zap, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

// Smooth Camera Controller that Lerps to focused Floor
const CameraController = () => {
  const { selectedFloor } = useStore();
  const controlsRef = useRef();

  useFrame((state) => {
    if (!controlsRef.current) return;

    let targetY = 6;
    let camY = 18;
    let camDistance = 34;

    if (selectedFloor !== null) {
      targetY = (selectedFloor - 1) * 3.8 + 1.2;
      camY = targetY + 6.5;
      camDistance = 24;
    }

    // Smooth lerp camera target
    controlsRef.current.target.y = THREE.MathUtils.lerp(controlsRef.current.target.y, targetY, 0.05);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={10}
      maxDistance={60}
      target={[0, 6, 0]}
    />
  );
};

export const BuildingCanvas = () => {
  const { 
    selectedFloor, 
    setSelectedFloor, 
    activeLayer, 
    setLayer,
    simulation
  } = useStore();

  const layers = [
    { id: 'status', label: 'Status', icon: Layers },
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'occupancy', label: 'Occupancy', icon: Users },
    { id: 'energy', label: 'Energy', icon: Zap },
  ];

  const floorsList = [
    { num: null, label: 'All Floors' },
    { num: 1, label: 'L1' },
    { num: 2, label: 'L2' },
    { num: 3, label: 'L3 (Active)' },
    { num: 4, label: 'L4' },
    { num: 5, label: 'L5' },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#F3F6FA] to-[#E2E8F0] rounded-2xl overflow-hidden border border-slate-200/90 shadow-card">
      {/* Three.js Canvas */}
      <Canvas
        shadows
        camera={{ position: [26, 22, 28], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[25, 40, 20]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={80}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />
        <pointLight position={[-20, 15, -15]} intensity={0.5} color="#00A9A0" />

        <BuildingTwin />
        <CameraController />
      </Canvas>

      {/* Top Floating Controls: Floor Selector */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center space-x-1 z-10">
        <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">Floors</span>
        {floorsList.map((f) => (
          <button
            key={f.num === null ? 'all' : f.num}
            onClick={() => setSelectedFloor(f.num)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedFloor === f.num
                ? 'bg-teal-brand text-white shadow-sm shadow-teal-brand/30'
                : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Top Right Floating Controls: Heatmap Layer Toggles */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center space-x-1 z-10">
        <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">Layers</span>
        {layers.map((l) => {
          const Icon = l.icon;
          const isActive = activeLayer === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setLayer(l.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-brand' : 'text-slate-500'}`} />
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm text-xs flex items-center space-x-4 z-10">
        {activeLayer === 'status' && (
          <>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-status-optimal" />
              <span className="text-slate-600 font-medium">Optimal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-status-warning" />
              <span className="text-slate-600 font-medium">Warning</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-status-critical" />
              <span className="text-slate-600 font-medium">Critical</span>
            </div>
          </>
        )}
        {activeLayer === 'temperature' && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Cool (&lt;21°C)</span>
            <div className="w-24 h-2 rounded-full bg-gradient-to-r from-sky-400 via-teal-500 to-red-500" />
            <span className="text-slate-500 font-medium">Hot (&gt;27°C)</span>
          </div>
        )}
        {activeLayer === 'occupancy' && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Empty (0)</span>
            <div className="w-24 h-2 rounded-full bg-gradient-to-r from-slate-400 via-teal-500 to-purple-600" />
            <span className="text-slate-500 font-medium">Full (45+)</span>
          </div>
        )}
        {activeLayer === 'energy' && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Low &lt;2kW</span>
            <div className="w-24 h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500" />
            <span className="text-slate-500 font-medium">High &gt;4kW</span>
          </div>
        )}
      </div>

      {/* Simulation Playback Banner if active */}
      {simulation.isRunning && (
        <div className="absolute bottom-4 right-4 bg-navy-900/95 text-white backdrop-blur-md px-4 py-2.5 rounded-xl border border-teal-brand shadow-xl z-10 flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-teal-brand animate-ping" />
          <div>
            <div className="text-xs font-bold text-white capitalize">
              Simulating: {simulation.scenarioType?.replace('_', ' ')}
            </div>
            <div className="text-[11px] text-teal-light">
              Interactive 3D playback in progress ({simulation.progress}%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
