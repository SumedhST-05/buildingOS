import React from 'react';
import { useStore } from '../../store/useStore';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  Wind, 
  Server, 
  Leaf, 
  FileText, 
  Cpu, 
  Activity,
  Radio
} from 'lucide-react';

const navItems = [
  { id: 'site_overview', label: 'Site Overview', icon: Building2 },
  { id: 'multifloor', label: 'Multi-Floor', icon: Layers, isDefault: true },
  { id: 'security', label: 'Security Hub', icon: ShieldCheck },
  { id: 'environmental', label: 'Environmental Controls', icon: Wind },
  { id: 'assets', label: 'Asset Management', icon: Server },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  { id: 'reports', label: 'Reports', icon: FileText }
];

export const NavySidebar = () => {
  const { activeNav, setActiveNav, alerts } = useStore();
  const unreadAlerts = alerts.filter(a => !a.resolved).length;

  return (
    <aside className="w-64 bg-navy-900 text-white flex flex-col justify-between shrink-0 shadow-xl z-20">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-navy-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-brand to-teal-glow flex items-center justify-center shadow-teal-glow/50 shadow-md">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight text-white">Building</span>
                <span className="font-extrabold text-lg tracking-tight text-teal-brand">OS</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium tracking-wide uppercase">Intelligent Building OS</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-brand text-white shadow-md shadow-teal-brand/30 font-semibold'
                    : 'text-slate-200 hover:text-white hover:bg-navy-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'security' && unreadAlerts > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-status-critical text-white rounded-full font-bold">
                    {unreadAlerts}
                  </span>
                )}
                {item.id === 'multifloor' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-navy-800 text-teal-brand'
                  }`}>
                    Hero
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info: Digital Twin Status */}
      <div className="p-4 border-t border-navy-800/80 bg-navy-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-brand"></span>
            </span>
            <span className="text-xs font-medium text-slate-200">Twin Sync Active</span>
          </div>
          <span className="text-[11px] font-mono text-teal-glow bg-navy-900 px-2 py-0.5 rounded border border-teal-brand/30">
            2.0s Telemetry
          </span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-navy-800/40 text-[11px] text-slate-300 flex items-center justify-between">
          <span>Campus Quad • Hall L1-L5</span>
          <Radio className="w-3.5 h-3.5 text-teal-brand" />
        </div>
      </div>
    </aside>
  );
};
