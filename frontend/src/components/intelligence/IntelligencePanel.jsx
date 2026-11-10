import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, 
  TrendingUp, 
  PlayCircle, 
  Zap, 
  AlertTriangle, 
  Clock, 
  Flame, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import axios from 'axios';
import confetti from 'canvas-confetti';

const BACKEND_URL = 'http://localhost:5001';

export const IntelligencePanel = () => {
  const { 
    isIntelPanelOpen, 
    toggleIntelPanel, 
    activeIntelTab, 
    setActiveIntelTab, 
    setLoopStage,
    simulation,
    runSimulation,
    recommendations,
    applyRecommendation,
    telemetry
  } = useStore();

  const [activeTab, setActiveTab] = useState(activeIntelTab || 'predict');
  const [equipmentRisk, setEquipmentRisk] = useState([]);
  const [demandForecast, setDemandForecast] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('fire_evacuation');
  const [targetFloor, setTargetFloor] = useState(5);
  const [isApplyingRec, setIsApplyingRec] = useState({});

  useEffect(() => {
    setActiveTab(activeIntelTab);
  }, [activeIntelTab]);

  // Load Predict data
  useEffect(() => {
    if (activeTab === 'predict') {
      setLoopStage('PREDICT');
      axios.post(`${BACKEND_URL}/api/intelligence/predict/failure`)
        .then(res => setEquipmentRisk(res.data.equipment || []))
        .catch(() => {});

      axios.post(`${BACKEND_URL}/api/intelligence/predict/demand`)
        .then(res => setDemandForecast(res.data.forecast || []))
        .catch(() => {});
    } else if (activeTab === 'simulate') {
      setLoopStage('SIMULATE');
    } else if (activeTab === 'optimize') {
      setLoopStage('OPTIMIZE');
    }
  }, [activeTab]);

  if (!isIntelPanelOpen) return null;

  const handleRunSim = async () => {
    await runSimulation(selectedScenario, targetFloor);
  };

  const handleApply = async (recId) => {
    setIsApplyingRec(prev => ({ ...prev, [recId]: true }));
    await applyRecommendation(recId);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setIsApplyingRec(prev => ({ ...prev, [recId]: false }));
    }, 800);
  };

  const cumulativeSavings = telemetry?.building?.cumulativeSavings || { kwh: 48.6, costUsd: 114.20, co2Kg: 33.4 };

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] max-w-full bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-navy-900 text-white">
        <div>
          <h2 className="font-bold text-base flex items-center space-x-2 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-brand animate-ping" />
            <span>Three Intelligence Functions</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">AI Reasoning • Simulation Engine • Operational Optimization</p>
        </div>
        <button 
          onClick={toggleIntelPanel}
          className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 3 Tabs (Predict, Simulate, Optimize) */}
      <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
        {[
          { id: 'predict', label: '1. PREDICT', icon: TrendingUp, subtitle: 'Failures & Demand' },
          { id: 'simulate', label: '2. SIMULATE', icon: PlayCircle, subtitle: 'Scenarios' },
          { id: 'optimize', label: '3. OPTIMIZE', icon: Zap, subtitle: 'Energy & Actions' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 pb-2.5 pt-1 px-2 text-xs font-bold transition-all border-b-2 text-center ${
                isActive
                  ? 'border-teal-brand text-teal-brand'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-1.5">
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </div>
              <div className="text-[10px] font-normal text-slate-400 mt-0.5">{tab.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB 1: PREDICT */}
        {activeTab === 'predict' && (
          <div className="space-y-5">
            {/* Equipment Failure Risk Ranking */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider">
                  Equipment Health &amp; Failure Risk
                </h4>
                <span className="text-[10px] text-slate-400">Ranked by Criticality</span>
              </div>

              <div className="space-y-2">
                {equipmentRisk.map((eq) => (
                  <div key={eq.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-navy-900">{eq.name}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        eq.failureRisk > 70 ? 'bg-red-100 text-status-critical border border-red-200' :
                        eq.failureRisk > 30 ? 'bg-amber-100 text-status-warning border border-amber-200' :
                        'bg-emerald-100 text-status-optimal border border-emerald-200'
                      }`}>
                        {eq.failureRisk}% Risk
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <div>Location: Floor {eq.floorNumber} (Room {eq.roomNumber})</div>
                      <div className="flex items-center space-x-1 text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Est. TTF: <strong className={eq.failureRisk > 70 ? 'text-status-critical' : 'text-navy-900'}>{eq.ttfHours}h</strong></span>
                      </div>
                    </div>

                    {/* Stressor Diagnostic */}
                    <div className="text-[11px] text-slate-500 bg-white p-1.5 rounded border border-slate-100">
                      Stressor: <span className="text-slate-700 italic">{eq.stressor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demand Forecast Chart (24h) with Confidence Interval */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider">
                  24h Energy &amp; Occupancy Forecast
                </h4>
                <span className="text-[10px] text-teal-brand font-semibold">95% Confidence Band</span>
              </div>

              <div className="h-44 w-full bg-slate-50 p-2 rounded-xl border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demandForecast} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A9A0" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00A9A0" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B2A5B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 11 }} />
                    <Area type="monotone" dataKey="upperCi" stroke="#00A9A0" strokeDasharray="3 3" fillOpacity={1} fill="url(#ciGrad)" name="Upper Bound (kWh)" />
                    <Area type="monotone" dataKey="lowerCi" stroke="#00A9A0" strokeDasharray="3 3" fill="none" name="Lower Bound (kWh)" />
                    <Line type="monotone" dataKey="kwh" stroke="#1E3A8A" strokeWidth={2} dot={false} name="Expected Load (kWh)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIMULATE */}
        {activeTab === 'simulate' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider mb-2">
                Scenario Configuration
              </h4>

              {/* Scenario Picker */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'fire_evacuation', label: 'Fire Evacuation', icon: Flame, floor: 5, desc: 'Egress paths & bottleneck' },
                  { id: 'hvac_failure', label: 'HVAC Failure', icon: AlertTriangle, floor: 3, desc: 'Room thermal drift' },
                  { id: 'power_outage', label: 'Power Outage', icon: Zap, floor: 1, desc: 'Backup generator & UPS' },
                  { id: 'occupancy_surge', label: 'Occupancy Surge', icon: TrendingUp, floor: 2, desc: 'Auditorium CO2 load' },
                ].map((sc) => {
                  const Icon = sc.icon;
                  const isSelected = selectedScenario === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setSelectedScenario(sc.id);
                        setTargetFloor(sc.floor);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-teal-brand bg-teal-light/50 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-navy-900">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-brand' : 'text-slate-500'}`} />
                        <span>{sc.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">{sc.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Floor Picker */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
              <span className="font-medium text-slate-600">Simulate on Floor:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTargetFloor(f)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                      targetFloor === f
                        ? 'bg-navy-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Floor {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Simulation Button */}
            <button
              onClick={handleRunSim}
              disabled={simulation.isRunning}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                simulation.isRunning
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-brand hover:bg-teal-hover text-white shadow-teal-brand/30'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>{simulation.isRunning ? `Running Simulation (${simulation.progress}%)...` : 'Run 3D Digital Twin Simulation'}</span>
            </button>

            {/* Simulation Results Display */}
            {simulation.results && (
              <div className="p-4 bg-navy-900 text-white rounded-xl space-y-2 border border-teal-brand/40 shadow-lg">
                <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                  <span className="text-xs font-bold text-teal-glow uppercase tracking-wider">Simulation Output</span>
                  <span className="text-[10px] bg-teal-brand/20 text-teal-light px-2 py-0.5 rounded">Completed</span>
                </div>

                {simulation.scenarioType === 'fire_evacuation' && (
                  <div className="space-y-1.5 text-xs text-slate-200">
                    <div>Total Clearance Time: <strong className="text-white">{simulation.results.clearanceTimeSeconds} seconds</strong></div>
                    <div>Bottleneck Identified: <strong className="text-status-critical">{simulation.results.bottleneck}</strong></div>
                    <div>Flow Rate: <strong className="text-white">{simulation.results.flowRatePeoplePerSec} people/sec</strong></div>
                    <div className="pt-2 text-[11px] text-teal-light">
                      Animated egress vectors are live on the Floor 5 Digital Twin.
                    </div>
                  </div>
                )}

                {simulation.scenarioType !== 'fire_evacuation' && (
                  <div className="space-y-1.5 text-xs text-slate-200">
                    <div>Peak Thermal Drift: <strong className="text-status-critical">{simulation.results.peakDriftTemp}°C</strong></div>
                    <div>Affected Rooms: <strong className="text-white">{simulation.results.affectedRoomsCount} rooms</strong></div>
                    <p className="text-[11px] text-slate-300 mt-1">{simulation.results.results}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OPTIMIZE */}
        {activeTab === 'optimize' && (
          <div className="space-y-4">
            {/* Real-time Savings Counter */}
            <div className="bg-gradient-to-r from-teal-brand to-teal-hover text-white p-4 rounded-xl shadow-teal-glow">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-light flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BuildingOS Operational Savings Counter</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs text-teal-light">Energy Saved</div>
                  <div className="text-base font-extrabold">{cumulativeSavings.kwh} kWh</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs text-teal-light">Cost Savings</div>
                  <div className="text-base font-extrabold">${cumulativeSavings.costUsd}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-xs text-teal-light">CO₂ Reduced</div>
                  <div className="text-base font-extrabold">{cumulativeSavings.co2Kg} kg</div>
                </div>
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="space-y-3">
              <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider">
                Proactive Actions
              </h4>

              {recommendations.map((rec) => {
                const isApplied = rec.status === 'applied';
                const isApplying = isApplyingRec[rec.id];

                return (
                  <div key={rec.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-navy-900">{rec.title}</span>
                      <span className="text-[10px] font-semibold text-teal-brand bg-teal-light px-2 py-0.5 rounded-full">
                        Save {rec.estimatedKwhSavings} kWh
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rec.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-slate-500">
                        Target: <span className="font-medium text-navy-900">{rec.target}</span>
                      </div>
                      <button
                        onClick={() => handleApply(rec.id)}
                        disabled={isApplied || isApplying}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                          isApplied
                            ? 'bg-emerald-100 text-status-optimal cursor-default'
                            : 'bg-teal-brand hover:bg-teal-hover text-white shadow-sm'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <>
                            <span>Apply Action</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
