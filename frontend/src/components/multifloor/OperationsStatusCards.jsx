import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Wind, 
  Shield, 
  Users, 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  Sparkles,
  TrendingDown
} from 'lucide-react';

export const OperationsStatusCards = () => {
  const { telemetry, applyRecommendation, recommendations } = useStore();
  const [isApplying, setIsApplying] = useState(false);
  const [activatedSuccess, setActivatedSuccess] = useState(false);

  const bldg = telemetry?.building || {};
  const kpi = bldg.kpi || { avgTemperature: 23.5, avgCo2: 580, avgHumidity: 45, totalPowerKw: 54.2, solarGenerationKw: 32.8 };
  const occupancies = bldg.floorOccupancies || { 1: 15, 2: 24, 3: 18, 4: 22, 5: 16 };
  const activeCameras = bldg.activeCameras || 58;
  const totalCameras = bldg.totalCameras || 60;
  const perimeterStatus = bldg.perimeterStatus || 'Secure';
  const totalPeople = bldg.totalCampusOccupancy || 95;
  const savings = bldg.cumulativeSavings || { kwh: 48.6, costUsd: 114.20 };

  // Generate 24h Clean Energy vs Grid data for the AreaChart
  const energyData = [
    { time: '00:00', solar: 0, grid: 22 },
    { time: '04:00', solar: 0, grid: 19 },
    { time: '08:00', solar: 18, grid: 34 },
    { time: '10:00', solar: 45, grid: 28 },
    { time: '12:00', solar: 68, grid: 14 },
    { time: '14:00', solar: 58, grid: 18 },
    { time: '16:00', solar: 32, grid: 29 },
    { time: '18:00', solar: 8, grid: 38 },
    { time: '20:00', solar: 0, grid: 31 },
    { time: '22:00', solar: 0, grid: 25 },
  ];

  const handleActivate = async () => {
    setIsApplying(true);
    // Find the lighting recommendation
    const rec = recommendations.find(r => r.id === 'rec_lighting_01') || recommendations[0];
    if (rec) {
      await applyRecommendation(rec.id);
    }
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00A9A0', '#00D4C8', '#10B981']
    });
    setActivatedSuccess(true);
    setIsApplying(false);
  };

  return (
    <div className="flex flex-col space-y-4 h-full overflow-y-auto pr-1">
      {/* CARD 1: Total Site Energy Portfolio (24h chart) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-bold text-navy-900 text-sm">Total Site Energy Portfolio</h3>
            <p className="text-[11px] text-slate-500">Clean solar vs. Grid draw (24h trend)</p>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="flex items-center space-x-1 font-semibold text-teal-brand">
              <span className="w-2 h-2 rounded-full bg-teal-brand" />
              <span>Solar: {kpi.solarGenerationKw} kW</span>
            </span>
            <span className="flex items-center space-x-1 font-semibold text-navy-700">
              <span className="w-2 h-2 rounded-full bg-navy-700" />
              <span>Grid: {kpi.gridImportKw} kW</span>
            </span>
          </div>
        </div>

        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A9A0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00A9A0" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B2A5B', borderRadius: 8, border: 'none', color: '#fff', fontSize: 11 }}
              />
              <Area type="monotone" dataKey="solar" stroke="#00A9A0" strokeWidth={2} fillOpacity={1} fill="url(#solarGrad)" />
              <Area type="monotone" dataKey="grid" stroke="#1E3A8A" strokeWidth={2} fillOpacity={1} fill="url(#gridGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD 2: HVAC & Air Quality (Slide 5: Temp 23.5°C, CO2 580, Humidity 45%) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-card">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-bold text-navy-900 text-sm">HVAC & Air Quality</h3>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-light text-teal-brand border border-teal-brand/30">
            Averages Across Floors
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Temperature */}
          <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex flex-col items-center text-center">
            <span className="text-[11px] font-medium text-slate-500">Temp</span>
            <span className="text-xl font-extrabold text-navy-900 my-0.5">{kpi.avgTemperature}°C</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
              Ideal
            </span>
          </div>

          {/* CO2 */}
          <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex flex-col items-center text-center">
            <span className="text-[11px] font-medium text-slate-500">CO₂</span>
            <span className="text-xl font-extrabold text-navy-900 my-0.5">{kpi.avgCo2}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
              Good
            </span>
          </div>

          {/* Humidity */}
          <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex flex-col items-center text-center">
            <span className="text-[11px] font-medium text-slate-500">Humidity</span>
            <span className="text-xl font-extrabold text-navy-900 my-0.5">{kpi.avgHumidity}%</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
              Ideal
            </span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Indoor Health Score</span>
          <span className="font-extrabold text-teal-brand flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>98/100 (Optimal)</span>
          </span>
        </div>
      </div>

      {/* CARD 3: Security & Occupancy (Slide 5: Total 95, Floor 3: 18, 58/60 Cameras) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-navy-900 text-sm">Security & Occupancy</h3>
          <div className="flex items-center space-x-1 text-xs font-bold text-navy-900">
            <Users className="w-3.5 h-3.5 text-teal-brand" />
            <span>{totalPeople} People</span>
          </div>
        </div>

        {/* Per-Floor Bars */}
        <div className="space-y-1.5 text-xs">
          {[
            { floor: 3, count: occupancies[3] || 18, max: 40, label: 'Floor 3 (Engineering)' },
            { floor: 4, count: occupancies[4] || 35, max: 50, label: 'Floor 4 (Library)' },
            { floor: 5, count: occupancies[5] || 42, max: 50, label: 'Floor 5 (Executive)' }
          ].map((item) => (
            <div key={item.floor} className="flex items-center justify-between">
              <span className="text-slate-600 text-[11px] w-24">Floor {item.floor}</span>
              <div className="flex-1 mx-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-brand rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (item.count / item.max) * 100)}%` }}
                />
              </div>
              <span className="font-bold text-navy-900 text-[11px] w-6 text-right">{item.count}</span>
            </div>
          ))}
        </div>

        {/* Camera & Perimeter status footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Camera className="w-3.5 h-3.5 text-slate-400" />
            <span>Cameras: <strong className="text-navy-900">{activeCameras}/{totalCameras}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600 justify-end">
            <Shield className="w-3.5 h-3.5 text-teal-brand" />
            <span>Perimeter: <strong className="text-teal-brand">{perimeterStatus}</strong></span>
          </div>
        </div>
      </div>

      {/* CARD 4: Recommended Action Card with ACTIVATE Button (Slide 5) */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-4 shadow-card border border-navy-800 flex flex-col justify-between relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-brand/20 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-glow flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Action</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200 font-mono">
              AI Insight
            </span>
          </div>

          <h4 className="text-base font-bold text-white leading-snug">
            Increase Energy Efficiency
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Adjust lighting based on usage. Transition Floor 3 & 4 corridors to daylight harvesting mode.
          </p>

          {/* Savings indicator */}
          <div className="mt-3 bg-navy-800/80 rounded-xl p-2 flex items-center justify-between text-xs border border-teal-brand/20">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <TrendingDown className="w-3.5 h-3.5 text-teal-brand" />
              <span>Projected Savings:</span>
            </div>
            <span className="font-extrabold text-teal-glow">
              ~18.4 kWh ($42.50)
            </span>
          </div>
        </div>

        {/* ACTIVATE Button */}
        <button
          onClick={handleActivate}
          disabled={isApplying || activatedSuccess}
          className={`mt-4 w-full py-2.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center space-x-2 transition-all duration-200 shadow-teal-glow ${
            activatedSuccess
              ? 'bg-status-optimal text-white cursor-default'
              : 'bg-teal-brand hover:bg-teal-hover active:scale-[0.98] text-white'
          }`}
        >
          {activatedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>ACTIVATED (Applied to Simulator)</span>
            </>
          ) : (
            <>
              <span>ACTIVATE</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
