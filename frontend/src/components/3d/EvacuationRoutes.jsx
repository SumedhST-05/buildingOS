import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useStore } from '../../store/useStore';

export const EvacuationRoutes = ({ floorY }) => {
  const { simulation } = useStore();
  const lineRef = useRef();
  const pulseRef = useRef(0);

  if (!simulation.isRunning || simulation.scenarioType !== 'fire_evacuation') {
    return null;
  }

  // Waypoints from rooms on Floor 5 towards Stairwells
  // Stairwell A: (-14, 4.5), Stairwell B: (13.5, 0)
  const paths = [
    [[-8, 0.4, 4.5], [0, 0.4, 0], [13, 0.4, 0]], // North wing to Stairwell B
    [[7, 0.4, 4.5], [10, 0.4, 2], [13, 0.4, 0]],  // Sky Conference to Stairwell B
    [[7, 0.4, -4.5], [10, 0.4, -2], [13, 0.4, 0]], // Greenhouse to Stairwell B
    [[-9, 0.4, 4.5], [-12, 0.4, 4.5], [-14, 0.4, 4.5]], // West wing to Stairwell A
  ];

  return (
    <group position={[0, floorY + 0.1, 0]}>
      {paths.map((points, idx) => {
        const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
        const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.12, 8, false);

        return (
          <mesh key={idx} geometry={tubeGeom}>
            <meshBasicMaterial color="#00A9A0" transparent opacity={0.8} />
          </mesh>
        );
      })}

      {/* Bottleneck Marker at East Stairwell B */}
      <group position={[13.5, 0.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color="#EF4444" wireframe />
        </mesh>
        <Html position={[0, 1.2, 0]} center distanceFactor={20}>
          <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg animate-pulse whitespace-nowrap border border-white/50">
            ⚠️ BOTTLENECK: Stairwell B (Flow: 1.8 p/s)
          </div>
        </Html>
      </group>
    </group>
  );
};
