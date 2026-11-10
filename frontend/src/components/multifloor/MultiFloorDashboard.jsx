import React from 'react';
import { BuildingCanvas } from '../3d/BuildingCanvas';
import { OperationsStatusCards } from './OperationsStatusCards';
import { useStore } from '../../store/useStore';

export const MultiFloorDashboard = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
      {/* Left: 3D Digital Twin Hero (7 columns out of 12) */}
      <div className="lg:col-span-7 h-full flex flex-col min-h-[480px]">
        <BuildingCanvas />
      </div>

      {/* Right: Multi-Floor Operations Status Cards (5 columns out of 12) */}
      <div className="lg:col-span-5 h-full flex flex-col overflow-hidden">
        <OperationsStatusCards />
      </div>
    </div>
  );
};
