import React from 'react';
import { useStore } from '../../store/useStore';
import { 
  ChevronRight, 
  Building, 
  Flame, 
  BrainCircuit, 
  Bell, 
  Sparkles,
  Layers
} from 'lucide-react';
import { LoopIndicator } from './LoopIndicator';

export const TopBreadcrumb = () => {
  const { 
    selectedFloor, 
    selectedRoomId, 
    selectedRoom, 
    setSelectedFloor, 
    setSelectedRoom,
    setFaultModalOpen,
    toggleIntelPanel,
    isIntelPanelOpen,
    alerts 
  } = useStore();

  const unreadAlerts = alerts.filter(a => !a.resolved);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shadow-sm z-10">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
        <button 
          onClick={() => { setSelectedFloor(null); }}
          className="flex items-center space-x-1.5 hover:text-navy-900 transition-colors"
        >
          <Building className="w-4 h-4 text-slate-400" />
          <span>Site Complex</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

        <button 
          onClick={() => { setSelectedFloor(null); }}
          className="hover:text-navy-900 transition-colors"
        >
          <span>Multi-Floor Dashboard</span>
        </button>

        {selectedFloor && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button 
              onClick={() => setSelectedFloor(selectedFloor)}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                !selectedRoomId ? 'bg-teal-light text-teal-brand' : 'hover:text-navy-900'
              }`}
            >
              Floor {selectedFloor}
            </button>
          </>
        )}

        {selectedRoomId && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2.5 py-0.5 bg-teal-light text-teal-brand font-bold rounded-md flex items-center space-x-1 shadow-sm">
              <span>{selectedRoom?.name || `Room ${selectedRoomId.replace('room_', '')}`}</span>
            </span>
          </>
        )}
      </div>

      {/* Center: The Continuous 5-Step Loop Indicator */}
      <div className="hidden lg:block">
        <LoopIndicator />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        {/* Fault Injector Button (Demo script tool) */}
        <button
          onClick={() => setFaultModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-lg text-xs font-semibold shadow-sm transition-all"
          title="Inject Demo Faults (HVAC degradation, CO2 spike, etc.)"
        >
          <Flame className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
          <span>Inject Fault</span>
        </button>

        {/* Intelligence Functions Panel Toggle */}
        <button
          onClick={toggleIntelPanel}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
            isIntelPanelOpen
              ? 'bg-teal-brand text-white shadow-teal-brand/30'
              : 'bg-navy-50 hover:bg-navy-100 text-navy-900 border border-navy-200/60'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-teal-brand" />
          <span>Intelligence Engine</span>
          <span className="w-2 h-2 rounded-full bg-teal-brand animate-ping" />
        </button>

        {/* Alerts Pill */}
        {unreadAlerts.length > 0 && (
          <div className="flex items-center space-x-1 px-2.5 py-1 bg-red-50 text-status-critical border border-red-200 rounded-lg text-xs font-bold animate-pulse">
            <Bell className="w-3.5 h-3.5" />
            <span>{unreadAlerts.length} Alerts</span>
          </div>
        )}
      </div>
    </header>
  );
};
