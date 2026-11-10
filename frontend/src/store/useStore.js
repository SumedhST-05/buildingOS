import { create } from 'zustand';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5001';

export const useStore = create((set, get) => ({
  // Navigation & View
  activeNav: 'multifloor',
  selectedFloor: 3, // Default Floor 3 per deck flow
  selectedRoomId: 'room_304', // Default Hero Room 304
  selectedRoom: null,
  activeLayer: 'status', // 'status' | 'temperature' | 'occupancy' | 'energy'
  activeLoopStage: 'MONITOR', // 'MONITOR' | 'DETECT' | 'PREDICT' | 'SIMULATE' | 'OPTIMIZE'
  activeIntelTab: 'predict', // 'predict' | 'simulate' | 'optimize'

  // Modals & Drawers
  isRoomDrawerOpen: false,
  isFaultModalOpen: false,
  isIntelPanelOpen: false,

  // Real-time State
  building: null,
  floors: [],
  rooms: [],
  alerts: [],
  recommendations: [],
  telemetry: {
    building: {
      totalCampusOccupancy: 95,
      floorOccupancies: { 1: 15, 2: 24, 3: 18, 4: 22, 5: 16 },
      activeCameras: 58,
      totalCameras: 60,
      perimeterStatus: 'Secure',
      kpi: {
        avgTemperature: 23.5,
        avgCo2: 580,
        avgHumidity: 45,
        totalPowerKw: 54.2,
        solarGenerationKw: 32.8,
        gridImportKw: 21.4,
        cleanEnergyPercent: 60.5
      },
      cumulativeSavings: {
        kwh: 48.6,
        costUsd: 114.20,
        co2Kg: 33.4
      }
    },
    rooms: []
  },

  // Simulation State
  simulation: {
    isRunning: false,
    scenarioType: null,
    progress: 0,
    results: null
  },

  // Actions
  setActiveNav: (nav) => set({ activeNav: nav }),
  setSelectedFloor: (floorNum) => set({ selectedFloor: floorNum }),
  setSelectedRoom: (roomId) => {
    const state = get();
    const room = state.rooms.find(r => r.id === roomId || r.roomNumber === roomId) ||
                 state.telemetry.rooms.find(r => r.id === roomId || r.roomNumber === roomId);
    set({
      selectedRoomId: roomId,
      selectedRoom: room || null,
      isRoomDrawerOpen: true,
      selectedFloor: room ? room.floorNumber : state.selectedFloor
    });
  },
  closeRoomDrawer: () => set({ isRoomDrawerOpen: false }),
  setLayer: (layer) => set({ activeLayer: layer }),
  setLoopStage: (stage) => set({ activeLoopStage: stage }),
  setActiveIntelTab: (tab) => set({ activeIntelTab: tab, isIntelPanelOpen: true }),
  toggleIntelPanel: () => set((state) => ({ isIntelPanelOpen: !state.isIntelPanelOpen })),
  setFaultModalOpen: (isOpen) => set({ isFaultModalOpen: isOpen }),

  // Telemetry Ingestion from Socket.io
  updateTelemetry: (data) => {
    set((state) => {
      const updatedRooms = data.rooms || state.rooms;
      let selectedRoom = state.selectedRoom;
      if (state.selectedRoomId) {
        selectedRoom = updatedRooms.find(r => r.id === state.selectedRoomId || r.roomNumber === state.selectedRoomId) || selectedRoom;
      }

      // Check if any room has warning or critical to dynamically trigger DETECT loop indicator
      const hasAnomaly = updatedRooms.some(r => r.status === 'warning' || r.status === 'critical');
      let loopStage = state.activeLoopStage;
      if (hasAnomaly && loopStage === 'MONITOR') {
        loopStage = 'DETECT';
      }

      return {
        telemetry: data,
        rooms: updatedRooms,
        selectedRoom,
        activeLoopStage: loopStage
      };
    });
  },

  // API Actions
  fetchInitialData: async () => {
    try {
      const [bldgRes, floorsRes, alertsRes, recsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/building`),
        axios.get(`${BACKEND_URL}/api/floors`),
        axios.get(`${BACKEND_URL}/api/alerts`),
        axios.get(`${BACKEND_URL}/api/recommendations`)
      ]);

      if (bldgRes.data.success && floorsRes.data.success) {
        const fls = floorsRes.data.floors || [];
        const allRooms = fls.flatMap(f => f.rooms || []);
        set({
          building: bldgRes.data.building,
          floors: fls,
          rooms: allRooms
        });
      }
      if (alertsRes.data.success) {
        set({ alerts: alertsRes.data.alerts || [] });
      }
      if (recsRes.data.success) {
        set({ recommendations: recsRes.data.recommendations || [] });
      }

      // Initialize selected room to Room 304
      const room304Res = await axios.get(`${BACKEND_URL}/api/rooms/room_304`);
      if (room304Res.data.success) {
        set({ selectedRoom: room304Res.data.room });
      }
    } catch (err) {
      console.warn('[Store] Initial fetch error:', err.message);
    }
  },

  injectFault: async (type, targetRoomId = 'room_304') => {
    set({ activeLoopStage: 'DETECT' });
    try {
      const res = await axios.post(`${BACKEND_URL}/api/simulator/fault`, { type, targetRoomId });
      // Refresh alerts
      const alertsRes = await axios.get(`${BACKEND_URL}/api/alerts`);
      set({ alerts: alertsRes.data.alerts || [] });
      return res.data;
    } catch (err) {
      console.error('[Store] Fault injection error:', err);
    }
  },

  resetFaults: async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/simulator/fault/reset`);
      const alertsRes = await axios.get(`${BACKEND_URL}/api/alerts`);
      set({ alerts: alertsRes.data.alerts || [], activeLoopStage: 'MONITOR' });
    } catch (err) {
      console.error('[Store] Reset error:', err);
    }
  },

  resolveAlert: async (alertId) => {
    try {
      await axios.post(`${BACKEND_URL}/api/alerts/${alertId}/resolve`);
      set((state) => ({
        alerts: state.alerts.filter(a => a.id !== alertId)
      }));
    } catch (err) {
      console.error('[Store] Resolve alert error:', err);
    }
  },

  applyRecommendation: async (recId) => {
    set({ activeLoopStage: 'OPTIMIZE' });
    try {
      const res = await axios.post(`${BACKEND_URL}/api/recommendations/${recId}/apply`);
      const recsRes = await axios.get(`${BACKEND_URL}/api/recommendations`);
      set({ recommendations: recsRes.data.recommendations || [] });
      return res.data;
    } catch (err) {
      console.error('[Store] Apply recommendation error:', err);
    }
  },

  runSimulation: async (scenarioType, targetFloor = 5) => {
    set({
      activeLoopStage: 'SIMULATE',
      simulation: { isRunning: true, scenarioType, progress: 10, results: null }
    });

    try {
      const res = await axios.post(`${BACKEND_URL}/api/intelligence/simulate`, { scenarioType, targetFloor });
      
      // Animate progress simulation
      for (let p = 20; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 300));
        set(state => ({ simulation: { ...state.simulation, progress: p } }));
      }

      set({
        simulation: {
          isRunning: false,
          scenarioType,
          progress: 100,
          results: res.data
        }
      });
      return res.data;
    } catch (err) {
      console.error('[Store] Simulation error:', err);
      set(state => ({ simulation: { ...state.simulation, isRunning: false } }));
    }
  }
}));
