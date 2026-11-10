import React, { useState } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { Html } from '@react-three/drei';

export const RoomMesh = ({ room, isSelectedFloor, isOtherFloor }) => {
  const [hovered, setHovered] = useState(false);
  const { 
    selectedRoomId, 
    setSelectedRoom, 
    activeLayer,
    simulation 
  } = useStore();

  const isSelectedRoom = selectedRoomId === room.id || selectedRoomId === room.roomNumber;

  // Determine Color based on activeLayer
  const getColor = () => {
    // If simulation is running (e.g. HVAC failure), show heating up
    if (simulation.isRunning && simulation.scenarioType === 'hvac_failure' && room.floorNumber === 3) {
      return '#EF4444'; // thermal drift red
    }

    if (activeLayer === 'temperature') {
      const t = room.temperature || 23.0;
      if (t < 21) return '#06B6D4'; // Cool cyan
      if (t <= 24) return '#00A9A0'; // Ideal teal
      if (t <= 26.5) return '#F59E0B'; // Amber warm
      return '#EF4444'; // Red hot
    }

    if (activeLayer === 'occupancy') {
      const occ = room.occupancy || 0;
      if (occ === 0) return '#64748B'; // Empty slate
      if (occ < 15) return '#38BDF8'; // Low light blue
      if (occ < 30) return '#00A9A0'; // Moderate teal
      return '#8B5CF6'; // High purple
    }

    if (activeLayer === 'energy') {
      const kw = room.hvacPowerKw || 1.5;
      if (kw < 2.0) return '#10B981';
      if (kw < 3.8) return '#F59E0B';
      return '#EF4444';
    }

    // Default 'status' layer (green / amber / red)
    if (room.status === 'critical') return '#EF4444';
    if (room.status === 'warning') return '#F59E0B';
    return '#10B981'; // Optimal green
  };

  const baseColor = getColor();

  // Opacity & visibility logic
  let opacity = 0.85;
  if (isOtherFloor) opacity = 0.12;
  if (isSelectedRoom) opacity = 1.0;
  if (hovered) opacity = 0.95;

  const height = room.height ? room.height * 0.5 : 1.6;

  return (
    <group position={[room.x, height / 2, room.z]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setSelectedRoom(room.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[room.width * 0.94, height, room.depth * 0.94]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={opacity}
          roughness={0.2}
          metalness={0.1}
          emissive={isSelectedRoom ? '#00A9A0' : (hovered ? baseColor : '#000000')}
          emissiveIntensity={isSelectedRoom ? 0.6 : (hovered ? 0.35 : 0.05)}
        />
      </mesh>

      {/* Wireframe Outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(room.width * 0.94, height, room.depth * 0.94)]} />
        <lineBasicMaterial 
          color={isSelectedRoom ? '#FFFFFF' : (isOtherFloor ? '#94A3B8' : '#0B2A5B')} 
          transparent 
          opacity={isOtherFloor ? 0.2 : 0.6} 
        />
      </lineSegments>

      {/* Hero Badge for Room 304 */}
      {room.roomNumber === '304' && !isOtherFloor && (
        <Html position={[0, height * 0.8, 0]} center distanceFactor={28} pointerEvents="none">
          <div className="bg-navy-900/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-teal-brand shadow-md flex items-center space-x-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-brand animate-ping" />
            <span>Room 304</span>
          </div>
        </Html>
      )}

      {/* Hover Tooltip */}
      {hovered && !isOtherFloor && (
        <Html position={[0, height + 0.6, 0]} center distanceFactor={25} pointerEvents="none">
          <div className="bg-navy-950 text-white p-2.5 rounded-xl shadow-xl border border-teal-brand/40 text-xs w-48 pointer-events-none backdrop-blur-md">
            <div className="font-bold text-white flex items-center justify-between border-b border-navy-800 pb-1 mb-1.5">
              <span>{room.name}</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                room.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                room.status === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {room.status || 'optimal'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
              <div>Temp: <span className="text-white font-semibold">{room.temperature}°C</span></div>
              <div>Occupancy: <span className="text-white font-semibold">{room.occupancy}</span></div>
              <div>CO2: <span className="text-white font-semibold">{room.co2} ppm</span></div>
              <div>HVAC: <span className="text-teal-glow font-semibold">{room.hvacPowerKw} kW</span></div>
            </div>
            <div className="mt-1 pt-1 border-t border-navy-800 text-[10px] text-teal-brand font-medium">
              Click to inspect room details →
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
