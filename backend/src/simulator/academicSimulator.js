import { repo } from '../models/index.js';

class AcademicSimulator {
  constructor() {
    this.intervalId = null;
    this.io = null;
    this.roomsState = new Map();
    this.activeFaults = new Map();
    this.appliedOptimizations = new Set();
    this.cumulativeSavings = {
      kwh: 48.6,
      costUsd: 114.20,
      co2Kg: 33.4
    };
    this.camerasTotal = 60;
    this.camerasOnline = 58;
    this.perimeterStatus = 'Secure';
    this.simulatedMinute = 14 * 60; // Start at 14:00 (2:00 PM) for peak college lecture demo
  }

  async initialize(ioInstance) {
    this.io = ioInstance;
    const rooms = await repo.rooms.find();

    for (const r of rooms) {
      this.roomsState.set(r.id, {
        id: r.id,
        roomNumber: r.roomNumber,
        name: r.name,
        floorNumber: r.floorNumber,
        category: r.category,
        capacity: r.capacity,
        temperature: r.targetTemp || 23.0,
        humidity: r.targetHumidity || 45,
        co2: r.targetCo2 || 520,
        occupancy: this.getInitialOccupancy(r),
        lightingLevel: 450,
        lightingState: true,
        hvacState: 'cooling',
        hvacPowerKw: 2.4,
        doorStatus: 'closed',
        cctvStatus: 'online',
        status: 'optimal' // optimal, warning, critical
      });
    }

    console.log(`[Simulator] Initialized simulation state for ${this.roomsState.size} rooms.`);
  }

  getInitialOccupancy(room) {
    if (room.roomNumber === '304') return 18; // Aligned with Slide 5 mock (Floor 3: 18)
    if (room.category === 'classroom') return Math.floor(room.capacity * 0.45);
    if (room.category === 'lab') return Math.floor(room.capacity * 0.5);
    if (room.category === 'office') return Math.floor(room.capacity * 0.3);
    if (room.category === 'stairwell') return 0;
    return Math.floor(room.capacity * 0.2);
  }

  start() {
    if (this.intervalId) clearInterval(this.intervalId);

    console.log('🚀 [Simulator] Real-time 2-second telemetry loop started.');
    this.intervalId = setInterval(() => {
      this.tick();
    }, 2000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    this.simulatedMinute = (this.simulatedMinute + 1) % 1440;
    const hour = Math.floor(this.simulatedMinute / 60);

    // Diurnal sunlight and schedule factors
    const sunFactor = Math.max(0, Math.sin(((hour - 6) / 14) * Math.PI)); // peaks around 13:00

    let totalCampusOccupancy = 0;
    let totalHvacKw = 0;
    let totalLightingKw = 0;
    let totalLabEquipmentKw = 0;
    const floorOccupancies = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const roomSnapshots = [];

    for (const [roomId, room] of this.roomsState.entries()) {
      const activeFault = this.activeFaults.get(roomId);
      const isHeroRoom = room.roomNumber === '304';

      // 1. Occupancy fluctuation
      let baseOcc = room.occupancy;
      if (Math.random() > 0.8) {
        const delta = Math.floor(Math.random() * 3) - 1;
        baseOcc = Math.max(0, Math.min(room.capacity, baseOcc + delta));
        room.occupancy = baseOcc;
      }
      floorOccupancies[room.floorNumber] += room.occupancy;
      totalCampusOccupancy += room.occupancy;

      // 2. Base Physics & Environmental drift
      const noise = (Math.random() - 0.5) * 0.1;
      let targetT = 23.0 + (isHeroRoom ? 0.5 : 0.0);
      let targetHum = 45;
      let targetCo2 = 450 + room.occupancy * 7;
      let hvacPower = 1.2 + room.occupancy * 0.06;
      let lightLux = 420;

      // Applied optimizations effects
      if (this.appliedOptimizations.has('rec_lighting_01') && (room.floorNumber === 3 || room.floorNumber === 4)) {
        lightLux = 310; // dimmed for daylight harvesting
      }
      if (this.appliedOptimizations.has('rec_hvac_02') && roomId === 'room_304') {
        targetT = 23.5;
        hvacPower *= 0.82; // 18% reduction
      }

      // Smooth step towards target
      room.temperature = Number((room.temperature + (targetT - room.temperature) * 0.05 + noise).toFixed(1));
      room.humidity = Math.round(room.humidity + (targetHum - room.humidity) * 0.05 + (Math.random() - 0.5));
      room.co2 = Math.round(room.co2 + (targetCo2 - room.co2) * 0.08 + (Math.random() * 4 - 2));
      room.lightingLevel = lightLux;
      room.lightingState = room.occupancy > 0;
      room.hvacState = 'cooling';
      room.hvacPowerKw = Number(hvacPower.toFixed(2));
      room.doorStatus = room.category === 'stairwell' ? 'closed' : (Math.random() > 0.95 ? 'open' : 'closed');
      room.status = 'optimal';

      // 3. Inject Fault Modifiers if active
      if (activeFault) {
        if (activeFault.type === 'hvac_degradation') {
          // Heat climbs, power spikes, severe anomaly
          activeFault.severityTicks = (activeFault.severityTicks || 0) + 1;
          const heatSurge = Math.min(6.5, activeFault.severityTicks * 0.25);
          room.temperature = Number((23.5 + heatSurge + (Math.random() * 0.2)).toFixed(1));
          room.hvacPowerKw = Number((4.8 + Math.random() * 0.6).toFixed(2));
          room.hvacState = 'fault';

          if (room.temperature > 26.5) {
            room.status = 'critical'; // Turns crimson red
          } else if (room.temperature > 24.5) {
            room.status = 'warning'; // Turns amber
          }
        } else if (activeFault.type === 'sensor_drift') {
          room.temperature = Number((room.temperature + 0.15).toFixed(1));
          room.status = 'warning';
        } else if (activeFault.type === 'co2_buildup') {
          room.co2 = Math.min(1800, room.co2 + 45);
          if (room.co2 > 1100) room.status = 'critical';
          else if (room.co2 > 800) room.status = 'warning';
        } else if (activeFault.type === 'door_forced') {
          room.doorStatus = 'forced';
          room.status = 'critical';
        }
      }

      totalHvacKw += room.hvacPowerKw;
      totalLightingKw += (room.lightingState ? (room.areaSqFt * 0.001) : 0.05);
      totalLabEquipmentKw += (room.category === 'lab' ? 3.5 : (room.category === 'server_room' ? 6.2 : 0.4));

      roomSnapshots.push({ ...room });
    }

    // Solar generation (peaks at 85 kW at noon)
    const solarGenerationKw = Number((sunFactor * 85.0 * (0.95 + Math.random() * 0.1)).toFixed(1));
    const totalBuildingLoadKw = Number((totalHvacKw + totalLightingKw + totalLabEquipmentKw + 15.0).toFixed(1));
    const gridImportKw = Number(Math.max(0, totalBuildingLoadKw - solarGenerationKw).toFixed(1));

    // Dynamic savings ticker if optimizations applied
    if (this.appliedOptimizations.size > 0) {
      this.cumulativeSavings.kwh = Number((this.cumulativeSavings.kwh + 0.015 * this.appliedOptimizations.size).toFixed(3));
      this.cumulativeSavings.costUsd = Number((this.cumulativeSavings.costUsd + 0.035 * this.appliedOptimizations.size).toFixed(2));
      this.cumulativeSavings.co2Kg = Number((this.cumulativeSavings.co2Kg + 0.011 * this.appliedOptimizations.size).toFixed(3));
    }

    // Construct Slide 5 Mockup Metrics
    const avgTemp = 23.5;
    const avgCo2 = 580;
    const avgHumidity = 45;

    const payload = {
      timestamp: new Date().toISOString(),
      building: {
        totalCampusOccupancy: totalCampusOccupancy || 95,
        floorOccupancies: {
          1: floorOccupancies[1] || 15,
          2: floorOccupancies[2] || 24,
          3: floorOccupancies[3] || 18, // Slide 5: Floor 3 = 18
          4: floorOccupancies[4] || 22,
          5: floorOccupancies[5] || 16
        },
        activeCameras: this.camerasOnline,
        totalCameras: this.camerasTotal,
        perimeterStatus: this.perimeterStatus,
        kpi: {
          avgTemperature: avgTemp,
          avgCo2: avgCo2,
          avgHumidity: avgHumidity,
          totalPowerKw: totalBuildingLoadKw,
          solarGenerationKw,
          gridImportKw,
          cleanEnergyPercent: Number(((solarGenerationKw / Math.max(1, totalBuildingLoadKw)) * 100).toFixed(1))
        },
        cumulativeSavings: this.cumulativeSavings
      },
      rooms: roomSnapshots
    };

    // Emit live to all connected WebSocket clients
    if (this.io) {
      this.io.emit('building:telemetry', payload);
    }

    // Save hero room telemetry sample
    const heroRoom = roomSnapshots.find(r => r.roomNumber === '304');
    if (heroRoom) {
      repo.telemetry.insertOne({
        roomId: heroRoom.id,
        floorNumber: heroRoom.floorNumber,
        timestamp: new Date(),
        temperature: heroRoom.temperature,
        humidity: heroRoom.humidity,
        co2: heroRoom.co2,
        occupancy: heroRoom.occupancy,
        lightingLevel: heroRoom.lightingLevel,
        lightingState: heroRoom.lightingState,
        hvacState: heroRoom.hvacState,
        hvacPowerKw: heroRoom.hvacPowerKw,
        doorStatus: heroRoom.doorStatus,
        cctvStatus: heroRoom.cctvStatus,
        roomEnergyKw: heroRoom.hvacPowerKw + 0.5
      }).catch(() => {});
    }
  }

  // Fault Injection API Handlers
  injectFault(type, targetRoomId = 'room_304') {
    console.log(`⚠️ [Simulator] Injected fault '${type}' on target room ${targetRoomId}`);
    this.activeFaults.set(targetRoomId, {
      type,
      startedAt: new Date(),
      severityTicks: 0
    });

    if (type === 'camera_offline') {
      this.camerasOnline = Math.max(0, this.camerasOnline - 1);
    } else if (type === 'door_forced') {
      this.perimeterStatus = 'Breach Detected';
    }

    return {
      success: true,
      fault: type,
      targetRoomId,
      message: `Fault ${type} successfully injected into ${targetRoomId}.`
    };
  }

  clearFault(targetRoomId = 'room_304') {
    this.activeFaults.delete(targetRoomId);
    this.camerasOnline = 58;
    this.perimeterStatus = 'Secure';
    const room = this.roomsState.get(targetRoomId);
    if (room) {
      room.status = 'optimal';
      room.temperature = 23.5;
      room.hvacPowerKw = 2.4;
      room.hvacState = 'cooling';
      room.doorStatus = 'closed';
    }
    return { success: true, message: `Faults cleared for ${targetRoomId}. Restored optimal status.` };
  }

  clearAllFaults() {
    this.activeFaults.clear();
    this.camerasOnline = 58;
    this.perimeterStatus = 'Secure';
    for (const [, room] of this.roomsState.entries()) {
      room.status = 'optimal';
      room.temperature = 23.0;
      room.hvacState = 'cooling';
      room.doorStatus = 'closed';
    }
    return { success: true, message: 'All simulation faults reset to baseline.' };
  }

  applyOptimization(recId) {
    this.appliedOptimizations.add(recId);
    console.log(`✅ [Simulator] Applied optimization action: ${recId}`);
    return {
      success: true,
      appliedRecId: recId,
      cumulativeSavings: this.cumulativeSavings
    };
  }
}

export const academicSimulator = new AcademicSimulator();
