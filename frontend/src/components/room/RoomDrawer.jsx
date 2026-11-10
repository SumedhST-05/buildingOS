import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, 
  Thermometer, 
  Droplets, 
  Wind, 
  Users, 
  Sun, 
  Zap, 
  DoorClosed, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5001';

export const RoomDrawer = () => {
  const { 
    isRoomDrawerOpen, 
    closeRoomDrawer, 
    selectedRoomId, 
    rooms, 
    telemetry,
    injectFault,
    applyRecommendation,
    recommendations 
  } = useStore();

  const [history, setHistory] = useState([]);
  const [appliedAction, setAppliedAction] = useState(false);

  // Retrieve room data from state or telemetry
  const room = (telemetry?.rooms || rooms).find(r => r.id === selectedRoomId || r.roomNumber === selectedRoomId) || {
    id: 'room_304',
    roomNumber: '304',
    name: 'Classroom 304 (Smart Lecture)',
    floorNumber: 3,
    category: 'classroom',
    capacity: 45,
    temperature: 23.5,
    humidity: 45,
    co2: 580,
    occupancy: 18,
    lightingLevel: 450,
    hvacState: 'cooling',
    hvacPowerKw: 2.4,
    doorStatus: 'closed',
    cctvStatus: 'online',
    status: 'optimal'
  };

  useEffect(() => {
    if (selectedRoomId) {
      axios.get(`${BACKEND_URL}/api/rooms/${selectedRoomId}/history`)
        .then(res => {
          if (res.data.success) {
            const formatted = res.data.history.map(item => ({
              time: new Date(item.timestamp).getHours() + ':00',
              temp: item.temperature,
              co2: item.co2,
              occupancy: item.occupancy
            }));
            setHistory(formatted);
          }
        })
        .catch(() => {});
    }
  }, [selectedRoomId]);

  if (!isRoomDrawerOpen) return null;

  const isCritical = room.status === 'critical';
  const isWarning = room.status === 'warning';

  return (
    <div className="fixed inset-y-0 right-0 w-96 max-w-full bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-navy-900 text-base">{room.name}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              isCritical ? 'bg-red-100 text-status-critical border border-red-300' :
              isWarning ? 'bg-amber-100 text-status-warning border border-amber-300' :
              'bg-emerald-100 text-status-optimal border border-emerald-300'
            }`}>
              {room.status || 'optimal'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Floor {room.floorNumber} • Capacity: {room.capacity} seats</p>
        </div>

        <button 
          onClick={closeRoomDrawer}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-navy-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Critical Anomaly Alert Banner if degraded */}
        {(isCritical || isWarning) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-status-critical">
              <AlertTriangle className="w-4 h-4" />
              <span>Anomaly Detected: Thermal Divergence</span>
            </div>
            <p className="text-[11px] text-red-700 leading-relaxed">
              AHU-3 cooling efficiency dropped while power draw spiked to {room.hvacPowerKw} kW.
            </p>
          </div>
        )}

        {/* Live Environmental KPI Grid */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live Conditions</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* Temperature */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Thermometer className="w-3.5 h-3.5 text-teal-brand" />
                <span>Temperature</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className={`text-xl font-extrabold ${isCritical ? 'text-status-critical' : 'text-navy-900'}`}>
                  {room.temperature}°C
                </span>
                <span className="text-[10px] text-slate-400">Target: 23.0°C</span>
              </div>
            </div>

            {/* Relative Humidity */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>Humidity</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-navy-900">{room.humidity}%</span>
                <span className="text-[10px] text-emerald-600 font-bold">Ideal</span>
              </div>
            </div>

            {/* CO2 */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Wind className="w-3.5 h-3.5 text-emerald-500" />
                <span>CO₂ Level</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-navy-900">{room.co2}</span>
                <span className="text-[10px] text-slate-400">ppm</span>
              </div>
            </div>

            {/* Occupancy */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Occupancy</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-navy-900">{room.occupancy}</span>
                <span className="text-[10px] text-slate-400">/ {room.capacity}</span>
              </div>
            </div>

            {/* Lighting */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Lighting</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-navy-900">{room.lightingLevel}</span>
                <span className="text-[10px] text-slate-400">lux (DALI)</span>
              </div>
            </div>

            {/* HVAC Power */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Zap className="w-3.5 h-3.5 text-teal-brand" />
                <span>HVAC Draw</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className={`text-xl font-extrabold ${isCritical ? 'text-status-critical' : 'text-navy-900'}`}>
                  {room.hvacPowerKw}
                </span>
                <span className="text-[10px] text-slate-400">kW</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Status */}
        <div className="bg-navy-900 text-white rounded-xl p-3 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DoorClosed className="w-4 h-4 text-teal-brand" />
            <div>
              <div className="font-semibold">Access: {room.doorStatus === 'forced' ? 'BREACH' : 'Secure'}</div>
              <div className="text-[10px] text-slate-300">RFID Smart Lock</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-teal-brand" />
            <div className="text-right">
              <div className="font-semibold text-teal-glow">CCTV {room.cctvStatus}</div>
              <div className="text-[10px] text-slate-300">Cam 304-N Active</div>
            </div>
          </div>
        </div>

        {/* 24-Hour Temperature Sparkline */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">24h Temperature Drift</span>
          <div className="h-28 w-full mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B2A5B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 11 }} />
                  <Line type="monotone" dataKey="temp" stroke="#00A9A0" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                Loading telemetry trend...
              </div>
            )}
          </div>
        </div>

        {/* Room Recommended Action (Step 5 of Slide 5: Receive Action) */}
        <div className="bg-gradient-to-br from-teal-light/50 to-white border border-teal-brand/30 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Action</span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Save 24.2 kWh
            </span>
          </div>

          <h5 className="font-bold text-navy-900 text-xs">
            Dynamic Setpoint Reset (+1.5°C)
          </h5>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Occupancy in Classroom 304 is currently 18 / 45. Shift cooling deadband to 23.5°C to conserve energy without compromising air quality.
          </p>

          <button
            onClick={async () => {
              await applyRecommendation('rec_hvac_02');
              setAppliedAction(true);
            }}
            disabled={appliedAction}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
              appliedAction
                ? 'bg-status-optimal text-white'
                : 'bg-teal-brand hover:bg-teal-hover text-white shadow-teal-brand/20'
            }`}
          >
            {appliedAction ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Action Executed for Room 304</span>
              </>
            ) : (
              <>
                <span>Execute Setpoint Reset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
