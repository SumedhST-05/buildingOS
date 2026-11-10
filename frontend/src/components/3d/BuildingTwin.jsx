import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { RoomMesh } from './RoomMesh';
import { EvacuationRoutes } from './EvacuationRoutes';

export const BuildingTwin = () => {
  const { floors, rooms, selectedFloor, setSelectedFloor, simulation } = useStore();
  const groupRef = useRef();

  // Sort floors 1 to 5
  const sortedFloors = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Ground plane shadow receiver */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#E9EFF8" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Grid helper */}
      <gridHelper args={[60, 30, '#00A9A0', '#CBD5E1']} position={[0, -0.18, 0]} />

      {sortedFloors.map((floor) => {
        const isSelectedFloor = selectedFloor === floor.floorNumber;
        const isOtherFloor = selectedFloor !== null && !isSelectedFloor;
        const floorRooms = rooms.filter(r => r.floorNumber === floor.floorNumber);

        // Floor elevation logic: when a floor is selected, we give it clear focus
        const elevationY = floor.elevationY || (floor.floorNumber - 1) * 3.8;

        return (
          <group key={floor.id} position={[0, elevationY, 0]}>
            {/* Floor Slab Geometry */}
            <mesh position={[0, -0.15, 0]} receiveShadow>
              <boxGeometry args={[35, 0.28, 22]} />
              <meshStandardMaterial
                color={isSelectedFloor ? '#00A9A0' : '#1E3A8A'}
                transparent
                opacity={isOtherFloor ? 0.08 : (isSelectedFloor ? 0.35 : 0.2)}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>

            {/* Slab Perimeter Glow Line */}
            <lineSegments position={[0, -0.15, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(35, 0.28, 22)]} />
              <lineBasicMaterial
                color={isSelectedFloor ? '#00D4C8' : '#3B82F6'}
                transparent
                opacity={isOtherFloor ? 0.15 : 0.7}
              />
            </lineSegments>

            {/* Floor Marker Label on the Left */}
            <Html position={[-19.5, 0.8, 0]} center distanceFactor={26}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFloor(isSelectedFloor ? null : floor.floorNumber);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 ${
                  isSelectedFloor
                    ? 'bg-teal-brand text-white ring-2 ring-teal-brand ring-offset-2 scale-110 shadow-teal-brand/40'
                    : 'bg-white/90 text-navy-900 hover:bg-teal-light hover:text-teal-brand border border-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelectedFloor ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                <span>Floor {floor.floorNumber}</span>
              </button>
            </Html>

            {/* Rooms for this floor */}
            {floorRooms.map((room) => (
              <RoomMesh
                key={room.id}
                room={room}
                isSelectedFloor={isSelectedFloor}
                isOtherFloor={isOtherFloor}
              />
            ))}

            {/* Evacuation simulation routes for Floor 5 */}
            {floor.floorNumber === 5 && (
              <EvacuationRoutes floorY={0} />
            )}
          </group>
        );
      })}
    </group>
  );
};
