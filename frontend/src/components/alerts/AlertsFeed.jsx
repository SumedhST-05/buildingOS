import React from 'react';
import { useStore } from '../../store/useStore';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  DoorClosed, 
  Wind, 
  X,
  ArrowRight
} from 'lucide-react';

export const AlertsFeed = () => {
  const { alerts, resolveAlert, setSelectedRoom } = useStore();
  const unreadAlerts = alerts.filter(a => !a.resolved);

  if (unreadAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 w-96 max-w-[90vw] z-40 space-y-2 pointer-events-none">
      {unreadAlerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          className="pointer-events-auto p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-red-200 text-xs animate-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-red-100 rounded-lg text-status-critical">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-navy-900 text-xs">{alert.title}</h4>
                <p className="text-[10px] text-slate-500">Floor {alert.floorNumber} • {alert.roomName || alert.roomNumber}</p>
              </div>
            </div>
            <button
              onClick={() => resolveAlert(alert.id)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-2 text-slate-600 text-[11px] leading-relaxed">
            {alert.message}
          </p>

          <div className="mt-2.5 p-2 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 flex items-start space-x-1.5">
            <span className="font-bold">Action:</span>
            <span>{alert.recommendedAction}</span>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                if (alert.roomId) setSelectedRoom(alert.roomId);
              }}
              className="font-bold text-teal-brand hover:text-teal-hover flex items-center space-x-1"
            >
              <span>Inspect Room</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => resolveAlert(alert.id)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-navy-900 font-semibold rounded-lg transition-colors"
            >
              Resolve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
