import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, 
  Flame, 
  Wind, 
  DoorClosed, 
  Camera, 
  RotateCcw, 
  AlertTriangle, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

export const FaultInjectorModal = () => {
  const { 
    isFaultModalOpen, 
    setFaultModalOpen, 
    injectFault, 
    resetFaults, 
    setSelectedFloor, 
    setSelectedRoom 
  } = useStore();

  const [activeFaultName, setActiveFaultName] = useState(null);

  if (!isFaultModalOpen) return null;

  const handleInject = async (type, room = 'room_304', label) => {
    setActiveFaultName(label);
    await injectFault(type, room);
    if (room === 'room_304') {
      setSelectedFloor(3);
      setSelectedRoom('room_304');
    }
  };

  const handleReset = async () => {
    setActiveFaultName(null);
    await resetFaults();
  };

  return (
    <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5" />
            <h3 className="font-bold text-base">Fault Injection Simulator</h3>
          </div>
          <button 
            onClick={() => setFaultModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600">
            Select a building system anomaly to test the <strong>Monitor → Detect → Predict → Simulate → Optimize</strong> loop in real-time.
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {/* 1. HVAC Degradation (Demo Script Hero) */}
            <button
              onClick={() => handleInject('hvac_degradation', 'room_304', 'HVAC Degradation (Room 304)')}
              className="p-3 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-50 text-left transition-all flex items-start space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-red-500 text-white mt-0.5 group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-red-950">HVAC Degradation (Floor 3 • Room 304)</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 bg-red-200 text-red-800 rounded">Demo Hero</span>
                </div>
                <p className="text-[11px] text-red-800 mt-0.5">
                  Spikes compressor power, cuts cooling efficiency, raises room temp, turns Room 304 amber then red.
                </p>
              </div>
            </button>

            {/* 2. CO2 Buildup */}
            <button
              onClick={() => handleInject('co2_buildup', 'room_304', 'CO2 Buildup')}
              className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-50 text-left transition-all flex items-start space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-amber-500 text-white mt-0.5 group-hover:scale-110 transition-transform">
                <Wind className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-xs text-amber-950">Ventilation Failure / CO₂ Buildup</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Restricts fresh air damper in Classroom 304, causing CO₂ to climb past 1200 ppm.
                </p>
              </div>
            </button>

            {/* 3. Door Forced Open */}
            <button
              onClick={() => handleInject('door_forced', 'room_308', 'East Stairwell Door Forced')}
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left transition-all flex items-start space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-slate-700 text-white mt-0.5 group-hover:scale-110 transition-transform">
                <DoorClosed className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-xs text-navy-900">Security Breach: Door Forced Open</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Triggers access control violation on Floor 3 East Stairwell Emergency Exit.
                </p>
              </div>
            </button>

            {/* 4. Camera Offline */}
            <button
              onClick={() => handleInject('camera_offline', 'room_102', 'CCTV Camera Offline')}
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left transition-all flex items-start space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-slate-700 text-white mt-0.5 group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-xs text-navy-900">CCTV Camera Dropout (57/60 Active)</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Simulates video signal loss on Quad Perimeter Camera.
                </p>
              </div>
            </button>
          </div>

          {/* Reset Baseline */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {activeFaultName ? `Active: ${activeFaultName}` : 'All systems normal.'}
            </span>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-navy-900 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Faults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
