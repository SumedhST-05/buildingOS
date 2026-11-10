import React from 'react';
import { useStore } from '../../store/useStore';
import { 
  Eye, 
  Radar, 
  TrendingUp, 
  PlayCircle, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

const steps = [
  { id: 'MONITOR', label: 'Monitor', icon: Eye, color: 'text-sky-600', activeBg: 'bg-sky-500 text-white' },
  { id: 'DETECT', label: 'Detect', icon: Radar, color: 'text-amber-600', activeBg: 'bg-amber-500 text-white shadow-amber-500/30' },
  { id: 'PREDICT', label: 'Predict', icon: TrendingUp, color: 'text-indigo-600', activeBg: 'bg-indigo-600 text-white shadow-indigo-500/30' },
  { id: 'SIMULATE', label: 'Simulate', icon: PlayCircle, color: 'text-purple-600', activeBg: 'bg-purple-600 text-white shadow-purple-500/30' },
  { id: 'OPTIMIZE', label: 'Optimize', icon: Zap, color: 'text-teal-brand', activeBg: 'bg-teal-brand text-white shadow-teal-glow' },
];

export const LoopIndicator = () => {
  const { activeLoopStage, setLoopStage } = useStore();

  return (
    <div className="flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/90 shadow-inner">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Loop</span>
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = activeLoopStage === step.id;

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setLoopStage(step.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? `${step.activeBg} shadow-md scale-105`
                  : 'text-slate-600 hover:text-navy-900 hover:bg-white/60'
              }`}
              title={`${step.label} Phase: ${isActive ? 'Active Now' : 'Click to preview'}`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : step.color}`} />
              <span>{step.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5" />
              )}
            </button>
            {idx < steps.length - 1 && (
              <span className="text-slate-300 text-xs font-bold">→</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
