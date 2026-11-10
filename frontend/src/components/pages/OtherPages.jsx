import React from 'react';
import { useStore } from '../../store/useStore';
import { 
  Building2, 
  ShieldCheck, 
  Wind, 
  Server, 
  Leaf, 
  FileText, 
  Camera, 
  DoorClosed, 
  CheckCircle2, 
  Clock, 
  Download,
  AlertTriangle,
  Zap
} from 'lucide-react';

export const SiteOverviewPage = () => {
  const { building, floors, telemetry } = useStore();
  const bldg = building || {};
  const kpi = telemetry?.building?.kpi || {};

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">{bldg.name || 'Hall of Sciences & Technology'}</h1>
          <p className="text-sm text-slate-500">{bldg.campus || 'North Campus Quad'} • {bldg.type || 'Academic & Research Complex'}</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-status-optimal font-bold text-xs rounded-full border border-emerald-200">
          Campus Baseline Normal
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Total Gross Area</div>
          <div className="text-2xl font-extrabold text-navy-900 mt-1">85,000 sq ft</div>
          <div className="text-[11px] text-teal-brand mt-1">5 Levels (L1 - L5)</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Current Power Draw</div>
          <div className="text-2xl font-extrabold text-navy-900 mt-1">{kpi.totalPowerKw || 54.2} kW</div>
          <div className="text-[11px] text-teal-brand mt-1">{kpi.cleanEnergyPercent || 60}% Solar Clean</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Live Occupancy</div>
          <div className="text-2xl font-extrabold text-navy-900 mt-1">{telemetry?.building?.totalCampusOccupancy || 95}</div>
          <div className="text-[11px] text-slate-400 mt-1">Classroom peak active</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Perimeter Security</div>
          <div className="text-2xl font-extrabold text-teal-brand mt-1">{telemetry?.building?.perimeterStatus || 'Secure'}</div>
          <div className="text-[11px] text-slate-400 mt-1">58/60 Cameras Online</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-navy-900 text-base mb-4">Floor Breakdown</h3>
        <div className="space-y-3">
          {floors.map(f => (
            <div key={f.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <div>
                <div className="font-bold text-navy-900 text-sm">{f.name}</div>
                <div className="text-xs text-slate-500">{f.areaSqFt} sq ft • Elevation +{f.elevationY}m</div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-white text-navy-900 rounded-lg border border-slate-200">
                Floor {f.floorNumber}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SecurityHubPage = () => {
  const { telemetry } = useStore();
  const bldg = telemetry?.building || {};
  const activeCams = bldg.activeCameras || 58;

  // Mock list of cameras
  const cameras = Array.from({ length: 12 }, (_, i) => ({
    id: `cam_${i + 1}`,
    name: `Camera 10${i + 1} - ${i < 4 ? 'Ground Lobby' : (i < 8 ? 'Floor 3 Quad' : 'Stairwell B')}`,
    status: i === 11 ? 'offline' : 'online',
    fps: 30,
    res: '1080p'
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">Security &amp; Access Hub</h1>
          <p className="text-sm text-slate-500">Video Surveillance, RFID Access Control, and Perimeter Monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-teal-light text-teal-brand font-bold text-xs rounded-full border border-teal-brand/30">
            {activeCams}/60 Cameras Online
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-status-optimal font-bold text-xs rounded-full">
            Perimeter {bldg.perimeterStatus || 'Secure'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {cameras.map(cam => (
          <div key={cam.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-32 bg-navy-950 relative flex items-center justify-center">
              <Camera className="w-8 h-8 text-slate-600" />
              <div className="absolute top-2 left-2 flex items-center space-x-1 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
                <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'online' ? 'bg-status-optimal animate-pulse' : 'bg-status-critical'}`} />
                <span>{cam.status.toUpperCase()}</span>
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400">
                {cam.fps} FPS • {cam.res}
              </div>
            </div>
            <div className="p-3">
              <div className="font-bold text-xs text-navy-900">{cam.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Motion: Low • Latency: 42ms</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EnvironmentalPage = () => {
  const { telemetry } = useStore();
  const kpi = telemetry?.building?.kpi || { avgTemperature: 23.5, avgCo2: 580, avgHumidity: 45 };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-900">Environmental Controls &amp; Air Quality</h1>
        <p className="text-sm text-slate-500">Real-time Indoor Environmental Quality (IEQ), ASHRAE 62.1 Compliance</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <Wind className="w-8 h-8 text-teal-brand mb-2" />
          <span className="text-xs font-semibold text-slate-500">Average Temperature</span>
          <span className="text-4xl font-extrabold text-navy-900 my-2">{kpi.avgTemperature}°C</span>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-status-optimal text-xs font-bold rounded-full">
            Ideal Comfort Zone
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <Wind className="w-8 h-8 text-sky-500 mb-2" />
          <span className="text-xs font-semibold text-slate-500">Carbon Dioxide (CO₂)</span>
          <span className="text-4xl font-extrabold text-navy-900 my-2">{kpi.avgCo2} ppm</span>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-status-optimal text-xs font-bold rounded-full">
            Well Below 1000 ppm
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <Wind className="w-8 h-8 text-indigo-500 mb-2" />
          <span className="text-xs font-semibold text-slate-500">Relative Humidity</span>
          <span className="text-4xl font-extrabold text-navy-900 my-2">{kpi.avgHumidity}%</span>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-status-optimal text-xs font-bold rounded-full">
            Balanced
          </span>
        </div>
      </div>
    </div>
  );
};

export const AssetManagementPage = () => {
  const { toggleIntelPanel, setActiveIntelTab } = useStore();

  const equipmentList = [
    { id: 'eq_chiller_01', name: 'Main Chilled Water Plant 01', type: 'HVAC Chiller', floor: 5, health: 94, ttf: '1850h', status: 'optimal' },
    { id: 'eq_chiller_02', name: 'Auxiliary Chiller 02', type: 'HVAC Chiller', floor: 5, health: 89, ttf: '1420h', status: 'optimal' },
    { id: 'eq_ahu_fl3', name: 'Floor 3 Air Handling Unit (AHU-3)', type: 'Air Handler', floor: 3, health: 42, ttf: '3.8h', status: 'critical' },
    { id: 'eq_elevator_01', name: 'Passenger Elevator Alpha (High Speed)', type: 'Elevator', floor: 1, health: 96, ttf: '3200h', status: 'optimal' },
    { id: 'eq_elevator_02', name: 'Service / Freight Elevator Beta', type: 'Elevator', floor: 1, health: 92, ttf: '2400h', status: 'optimal' },
    { id: 'eq_solar_array', name: 'Rooftop Bifacial Solar PV Array (140kW)', type: 'Solar Inverter', floor: 5, health: 98, ttf: '8500h', status: 'optimal' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">Asset Management &amp; Health Registry</h1>
          <p className="text-sm text-slate-500">Predictive Maintenance, Equipment Health Indices &amp; Remaining Useful Life</p>
        </div>
        <button
          onClick={() => {
            setActiveIntelTab('predict');
            toggleIntelPanel();
          }}
          className="px-3.5 py-2 bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          View Predictive AI Ranks
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-4">Equipment Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Location</th>
              <th className="p-4">Health Score</th>
              <th className="p-4">Est. TTF</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipmentList.map(eq => (
              <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-bold text-navy-900">{eq.name}</td>
                <td className="p-4 text-slate-600">{eq.type}</td>
                <td className="p-4 text-slate-600">Floor {eq.floor}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${eq.health > 70 ? 'bg-status-optimal' : 'bg-status-critical'}`}
                        style={{ width: `${eq.health}%` }}
                      />
                    </div>
                    <span className="font-bold text-navy-900">{eq.health}%</span>
                  </div>
                </td>
                <td className="p-4 font-mono font-semibold text-slate-700">{eq.ttf}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    eq.status === 'critical' ? 'bg-red-100 text-status-critical' : 'bg-emerald-100 text-status-optimal'
                  }`}>
                    {eq.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SustainabilityPage = () => {
  const { telemetry } = useStore();
  const savings = telemetry?.building?.cumulativeSavings || { kwh: 48.6, costUsd: 114.20, co2Kg: 33.4 };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-900">Sustainability &amp; ESG Metrics</h1>
        <p className="text-sm text-slate-500">Clean Energy Generation, Carbon Reduction &amp; Net-Zero Trajectory</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-teal-brand to-teal-hover text-white p-6 rounded-2xl shadow-teal-glow">
          <Leaf className="w-8 h-8 text-teal-light mb-2" />
          <div className="text-xs text-teal-light font-medium uppercase tracking-wider">CO₂ Avoided Today</div>
          <div className="text-3xl font-extrabold mt-1">{savings.co2Kg} kg</div>
          <div className="text-xs text-teal-light mt-1">Equivalent to planting 1.8 trees</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Zap className="w-8 h-8 text-amber-500 mb-2" />
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Clean Energy Generated</div>
          <div className="text-3xl font-extrabold text-navy-900 mt-1">142.4 kWh</div>
          <div className="text-xs text-teal-brand mt-1">Rooftop Solar PV Array</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Cumulative Cost Savings</div>
          <div className="text-3xl font-extrabold text-navy-900 mt-1">${savings.costUsd}</div>
          <div className="text-xs text-emerald-600 mt-1">Automated setpoint &amp; dimming</div>
        </div>
      </div>
    </div>
  );
};

export const ReportsPage = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">Operational Reports</h1>
          <p className="text-sm text-slate-500">Executive Briefings, Audit Trails, and ASHRAE Energy Verification</p>
        </div>
        <button 
          onClick={() => alert('Executive Report downloaded as PDF.')}
          className="flex items-center space-x-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-teal-brand" />
          <span>Export Summary (PDF)</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-navy-900 text-base">Daily Energy &amp; Performance Audit</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The Hall of Sciences operated at 98.4% uptime today. Peak solar generation offset 60.5% of daytime building demand.
          Automated lighting dimming in Floor 3 &amp; 4 saved 18.4 kWh. One mechanical anomaly was intercepted on Floor 3 AHU-3 prior to compressor failure.
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Generated by BuildingOS Intelligence Layer</span>
          <span>Verified: ISO 50001 Standard</span>
        </div>
      </div>
    </div>
  );
};
