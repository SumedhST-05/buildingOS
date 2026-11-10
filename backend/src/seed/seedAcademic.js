import { repo } from '../models/index.js';
import { connectDB } from '../db/db.js';

export async function seedDatabase() {
  console.log('[Seed] Seeding academic building topology and 24h telemetry...');

  // Clear existing
  await repo.buildings.deleteMany();
  await repo.floors.deleteMany();
  await repo.rooms.deleteMany();
  await repo.equipment.deleteMany();
  await repo.telemetry.deleteMany();
  await repo.alerts.deleteMany();
  await repo.recommendations.deleteMany();

  // 1. Building
  const building = await repo.buildings.create({
    id: 'bldg_academic_01',
    name: 'Hall of Sciences & Technology',
    type: 'Academic & Research',
    campus: 'North Campus Quad',
    totalFloors: 5,
    totalAreaSqFt: 85000,
    totalCameras: 60,
    activeCameras: 58,
    perimeterStatus: 'Secure'
  });

  // 2. Floors (1 to 5)
  const floorData = [
    { id: 'floor_1', floorNumber: 1, name: 'Floor 1 - Campus Commons & Services', buildingId: building.id, elevationY: 0, areaSqFt: 18000 },
    { id: 'floor_2', floorNumber: 2, name: 'Floor 2 - Physical Sciences & Labs', buildingId: building.id, elevationY: 3.8, areaSqFt: 17500 },
    { id: 'floor_3', floorNumber: 3, name: 'Floor 3 - Computing & Engineering', buildingId: building.id, elevationY: 7.6, areaSqFt: 17500 },
    { id: 'floor_4', floorNumber: 4, name: 'Floor 4 - University Library & Media', buildingId: building.id, elevationY: 11.4, areaSqFt: 16500 },
    { id: 'floor_5', floorNumber: 5, name: 'Floor 5 - Executive Suites & Chiller Plant', buildingId: building.id, elevationY: 15.2, areaSqFt: 15500 }
  ];
  await repo.floors.insertMany(floorData);

  // 3. Rooms across 5 floors
  // Room grid coordinates: centered around (0,0), bounds [-16..16] in X, [-10..10] in Z
  const roomsData = [
    // FLOOR 1
    { id: 'room_101', roomNumber: '101', name: 'Main Atrium & Lobby 101', floorNumber: 1, category: 'lobby', capacity: 60, areaSqFt: 2400, x: -8, z: 4.5, width: 14, depth: 7, height: 3.2, targetTemp: 22.5, targetHumidity: 45, targetCo2: 500, targetLux: 450, status: 'optimal' },
    { id: 'room_102', roomNumber: '102', name: 'Campus Security Hub 102', floorNumber: 1, category: 'office', capacity: 12, areaSqFt: 850, x: 7, z: 4.5, width: 8, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 42, targetCo2: 480, targetLux: 500, status: 'optimal' },
    { id: 'room_103', roomNumber: '103', name: 'Visitor Center 103', floorNumber: 1, category: 'office', capacity: 25, areaSqFt: 1200, x: 7, z: -4.5, width: 8, depth: 7, height: 3.2, targetTemp: 22.5, targetHumidity: 44, targetCo2: 520, targetLux: 400, status: 'optimal' },
    { id: 'room_104', roomNumber: '104', name: 'Campus Café & Dining 104', floorNumber: 1, category: 'dining', capacity: 80, areaSqFt: 3000, x: -6, z: -4.5, width: 12, depth: 7, height: 3.2, targetTemp: 23.0, targetHumidity: 48, targetCo2: 580, targetLux: 350, status: 'optimal' },
    { id: 'room_105', roomNumber: '105', name: 'Facilities Management 105', floorNumber: 1, category: 'facilities', capacity: 10, areaSqFt: 900, x: -14, z: -4.5, width: 6, depth: 7, height: 3.2, targetTemp: 21.5, targetHumidity: 40, targetCo2: 450, targetLux: 400, status: 'optimal' },
    { id: 'room_106', roomNumber: '106', name: 'Main Elevator & Stairwell A', floorNumber: 1, category: 'stairwell', capacity: 30, areaSqFt: 700, x: -14, z: 4.5, width: 5, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 300, status: 'optimal' },
    { id: 'room_107', roomNumber: '107', name: 'East Emergency Exit Stairwell B', floorNumber: 1, category: 'stairwell', capacity: 30, areaSqFt: 500, x: 13.5, z: 0, width: 4.5, depth: 15, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 250, status: 'optimal' },

    // FLOOR 2
    { id: 'room_201', roomNumber: '201', name: 'Grand Lecture Hall 201', floorNumber: 2, category: 'classroom', capacity: 90, areaSqFt: 2800, x: -8, z: 4.5, width: 14, depth: 7, height: 3.2, targetTemp: 22.8, targetHumidity: 46, targetCo2: 550, targetLux: 500, status: 'optimal' },
    { id: 'room_202', roomNumber: '202', name: 'Organic Chemistry Lab 202', floorNumber: 2, category: 'lab', capacity: 30, areaSqFt: 1600, x: 6, z: 4.5, width: 9, depth: 7, height: 3.2, targetTemp: 21.0, targetHumidity: 40, targetCo2: 520, targetLux: 600, status: 'optimal' },
    { id: 'room_203', roomNumber: '203', name: 'Applied Physics Lab 203', floorNumber: 2, category: 'lab', capacity: 30, areaSqFt: 1600, x: 6, z: -4.5, width: 9, depth: 7, height: 3.2, targetTemp: 21.5, targetHumidity: 42, targetCo2: 510, targetLux: 550, status: 'optimal' },
    { id: 'room_204', roomNumber: '204', name: 'Seminar Room 204', floorNumber: 2, category: 'classroom', capacity: 35, areaSqFt: 1100, x: -3, z: -4.5, width: 7, depth: 7, height: 3.2, targetTemp: 23.0, targetHumidity: 45, targetCo2: 530, targetLux: 450, status: 'optimal' },
    { id: 'room_205', roomNumber: '205', name: 'Faculty Offices Wing 205', floorNumber: 2, category: 'office', capacity: 20, areaSqFt: 1500, x: -9.5, z: -4.5, width: 7, depth: 7, height: 3.2, targetTemp: 22.5, targetHumidity: 43, targetCo2: 490, targetLux: 400, status: 'optimal' },
    { id: 'room_206', roomNumber: '206', name: 'Elevator Lobby & Stair A', floorNumber: 2, category: 'stairwell', capacity: 25, areaSqFt: 600, x: -14, z: 4.5, width: 5, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 300, status: 'optimal' },
    { id: 'room_207', roomNumber: '207', name: 'East Stairwell B (Exit)', floorNumber: 2, category: 'stairwell', capacity: 25, areaSqFt: 500, x: 13.5, z: 0, width: 4.5, depth: 15, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 250, status: 'optimal' },

    // FLOOR 3 (PRIMARY HERO FLOOR)
    { id: 'room_301', roomNumber: '301', name: 'Computer Science Lab 301', floorNumber: 3, category: 'lab', capacity: 40, areaSqFt: 1800, x: -8, z: 4.5, width: 10, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 42, targetCo2: 560, targetLux: 500, status: 'optimal' },
    { id: 'room_302', roomNumber: '302', name: 'Engineering Workspace 302', floorNumber: 3, category: 'lab', capacity: 35, areaSqFt: 1500, x: 0, z: 4.5, width: 7, depth: 7, height: 3.2, targetTemp: 22.5, targetHumidity: 44, targetCo2: 540, targetLux: 480, status: 'optimal' },
    { id: 'room_303', roomNumber: '303', name: 'Robotics & Automation Lab 303', floorNumber: 3, category: 'lab', capacity: 25, areaSqFt: 1400, x: 7, z: 4.5, width: 7, depth: 7, height: 3.2, targetTemp: 21.8, targetHumidity: 40, targetCo2: 510, targetLux: 520, status: 'optimal' },
    // HERO ROOM 304 (Slide 5: Choose Floor 3 -> Open Room 304)
    { id: 'room_304', roomNumber: '304', name: 'Classroom 304 (Smart Lecture)', floorNumber: 3, category: 'classroom', capacity: 45, areaSqFt: 1600, x: 5, z: -4.5, width: 9, depth: 7, height: 3.2, targetTemp: 23.5, targetHumidity: 45, targetCo2: 580, targetLux: 450, status: 'optimal' },
    { id: 'room_305', roomNumber: '305', name: 'Faculty Research Lounge 305', floorNumber: 3, category: 'lounge', capacity: 20, areaSqFt: 1000, x: -3, z: -4.5, width: 6, depth: 7, height: 3.2, targetTemp: 22.5, targetHumidity: 43, targetCo2: 490, targetLux: 380, status: 'optimal' },
    { id: 'room_306', roomNumber: '306', name: 'Department Server Room 306', floorNumber: 3, category: 'server_room', capacity: 4, areaSqFt: 800, x: -8.5, z: -4.5, width: 6, depth: 7, height: 3.2, targetTemp: 19.5, targetHumidity: 38, targetCo2: 440, targetLux: 300, status: 'optimal' },
    { id: 'room_307', roomNumber: '307', name: 'Elevator Lobby 3 & Stair A', floorNumber: 3, category: 'stairwell', capacity: 25, areaSqFt: 600, x: -14, z: 4.5, width: 5, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 300, status: 'optimal' },
    { id: 'room_308', roomNumber: '308', name: 'East Stairwell B (Primary Fire Egress)', floorNumber: 3, category: 'stairwell', capacity: 30, areaSqFt: 500, x: 13.5, z: 0, width: 4.5, depth: 15, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 250, status: 'optimal' },

    // FLOOR 4
    { id: 'room_401', roomNumber: '401', name: 'Central University Library 401', floorNumber: 4, category: 'library', capacity: 70, areaSqFt: 3400, x: -6, z: 4.5, width: 14, depth: 7, height: 3.2, targetTemp: 22.2, targetHumidity: 44, targetCo2: 510, targetLux: 400, status: 'optimal' },
    { id: 'room_402', roomNumber: '402', name: 'Quiet Study Commons 402', floorNumber: 4, category: 'library', capacity: 40, areaSqFt: 1800, x: 6, z: 4.5, width: 9, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 43, targetCo2: 480, targetLux: 350, status: 'optimal' },
    { id: 'room_412', roomNumber: '412', name: 'Advanced Seminar Room 412', floorNumber: 4, category: 'classroom', capacity: 30, areaSqFt: 1200, x: 6, z: -4.5, width: 8, depth: 7, height: 3.2, targetTemp: 23.0, targetHumidity: 45, targetCo2: 520, targetLux: 420, status: 'optimal' },
    { id: 'room_413', roomNumber: '413', name: 'Digital Media Studio 413', floorNumber: 4, category: 'lab', capacity: 20, areaSqFt: 1100, x: -1.5, z: -4.5, width: 7, depth: 7, height: 3.2, targetTemp: 21.5, targetHumidity: 41, targetCo2: 490, targetLux: 450, status: 'optimal' },
    { id: 'room_414', roomNumber: '414', name: 'Department Head Suites 414', floorNumber: 4, category: 'office', capacity: 15, areaSqFt: 1200, x: -8, z: -4.5, width: 7, depth: 7, height: 3.2, targetTemp: 22.5, targetHumidity: 44, targetCo2: 470, targetLux: 400, status: 'optimal' },
    { id: 'room_415', roomNumber: '415', name: 'Elevator Lobby 4 & Stair A', floorNumber: 4, category: 'stairwell', capacity: 25, areaSqFt: 600, x: -14, z: 4.5, width: 5, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 300, status: 'optimal' },
    { id: 'room_416', roomNumber: '416', name: 'East Stairwell B (Fire Egress)', floorNumber: 4, category: 'stairwell', capacity: 25, areaSqFt: 500, x: 13.5, z: 0, width: 4.5, depth: 15, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 250, status: 'optimal' },

    // FLOOR 5
    { id: 'room_501', roomNumber: '501', name: 'Dean Executive Suite 501', floorNumber: 5, category: 'office', capacity: 12, areaSqFt: 1400, x: -9, z: 4.5, width: 8, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 43, targetCo2: 480, targetLux: 450, status: 'optimal' },
    { id: 'room_502', roomNumber: '502', name: 'Academic Senate Chamber 502', floorNumber: 5, category: 'classroom', capacity: 55, areaSqFt: 2200, x: -0.5, z: 4.5, width: 9, depth: 7, height: 3.2, targetTemp: 22.8, targetHumidity: 45, targetCo2: 540, targetLux: 500, status: 'optimal' },
    { id: 'room_510', roomNumber: '510', name: 'Sky Conference Center 510', floorNumber: 5, category: 'classroom', capacity: 50, areaSqFt: 2000, x: 7.5, z: 4.5, width: 8, depth: 7, height: 3.2, targetTemp: 23.0, targetHumidity: 44, targetCo2: 530, targetLux: 480, status: 'optimal' },
    { id: 'room_511', roomNumber: '511', name: 'Rooftop Research Greenhouse 511', floorNumber: 5, category: 'lab', capacity: 20, areaSqFt: 1800, x: 7, z: -4.5, width: 9, depth: 7, height: 3.2, targetTemp: 25.0, targetHumidity: 65, targetCo2: 680, targetLux: 800, status: 'optimal' },
    { id: 'room_512', roomNumber: '512', name: 'Rooftop Chiller Plant & Solar Grid', floorNumber: 5, category: 'plant_room', capacity: 6, areaSqFt: 2500, x: -5, z: -4.5, width: 14, depth: 7, height: 3.2, targetTemp: 21.0, targetHumidity: 38, targetCo2: 440, targetLux: 350, status: 'optimal' },
    { id: 'room_513', roomNumber: '513', name: 'Elevator Lobby 5 & Stair A', floorNumber: 5, category: 'stairwell', capacity: 20, areaSqFt: 600, x: -14, z: 4.5, width: 5, depth: 7, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 300, status: 'optimal' },
    { id: 'room_514', roomNumber: '514', name: 'East Stairwell B (Primary Fire Egress)', floorNumber: 5, category: 'stairwell', capacity: 25, areaSqFt: 500, x: 13.5, z: 0, width: 4.5, depth: 15, height: 3.2, targetTemp: 22.0, targetHumidity: 45, targetCo2: 450, targetLux: 250, status: 'optimal' }
  ];
  await repo.rooms.insertMany(roomsData);

  // 4. Equipment
  const equipmentData = [
    { id: 'eq_chiller_01', name: 'Main Chilled Water Plant 01', type: 'hvac_chiller', floorNumber: 5, roomId: 'room_512', status: 'healthy', healthScore: 94, ttfHours: 1850, powerKw: 42.5 },
    { id: 'eq_chiller_02', name: 'Auxiliary Chiller 02', type: 'hvac_chiller', floorNumber: 5, roomId: 'room_512', status: 'healthy', healthScore: 89, ttfHours: 1420, powerKw: 35.0 },
    { id: 'eq_ahu_fl3', name: 'Floor 3 Air Handling Unit (AHU-3)', type: 'ahu', floorNumber: 3, roomId: 'room_304', status: 'healthy', healthScore: 91, ttfHours: 1200, powerKw: 12.8 },
    { id: 'eq_elevator_01', name: 'Passenger Elevator Alpha (High Speed)', type: 'elevator', floorNumber: 1, roomId: 'room_106', status: 'healthy', healthScore: 96, ttfHours: 3200, powerKw: 7.5 },
    { id: 'eq_elevator_02', name: 'Service / Freight Elevator Beta', type: 'elevator', floorNumber: 1, roomId: 'room_106', status: 'healthy', healthScore: 92, ttfHours: 2400, powerKw: 8.2 },
    { id: 'eq_solar_array', name: 'Rooftop Bifacial Solar PV Array (140kW)', type: 'solar_inverter', floorNumber: 5, roomId: 'room_512', status: 'healthy', healthScore: 98, ttfHours: 8500, powerKw: 78.0 },
    { id: 'eq_lighting_fl3', name: 'Floor 3 DALI Intelligent Lighting Controller', type: 'lighting_controller', floorNumber: 3, roomId: 'room_304', status: 'healthy', healthScore: 95, ttfHours: 5400, powerKw: 3.4 }
  ];
  await repo.equipment.insertMany(equipmentData);

  // 5. Initial Recommendations (Slide 5 deck aligned)
  const recommendationsData = [
    {
      id: 'rec_lighting_01',
      title: 'Increase Energy Efficiency',
      category: 'lighting',
      description: 'Adjust lighting based on usage. Dim unoccupied corridors and transition classrooms to 60% ambient daylight harvesting.',
      target: 'Floor 3 & 4 Lighting Panels',
      estimatedKwhSavings: 18.4,
      estimatedCostSavingsUsd: 42.50,
      estimatedCo2ReductionKg: 12.6,
      status: 'active',
      actionPayload: { action: 'dim_lighting', targetFloor: 3, dimPercent: 35 }
    },
    {
      id: 'rec_hvac_02',
      title: 'Dynamic HVAC Setpoint Reset',
      category: 'hvac',
      description: 'Shift Classroom 304 temperature deadband from 22.0°C to 23.5°C during afternoon low-attendance period.',
      target: 'Classroom 304 & AHU-3',
      estimatedKwhSavings: 24.2,
      estimatedCostSavingsUsd: 58.00,
      estimatedCo2ReductionKg: 16.8,
      status: 'active',
      actionPayload: { action: 'setpoint_reset', targetRoom: 'room_304', setpointTemp: 23.5 }
    },
    {
      id: 'rec_solar_03',
      title: 'Solar Pre-Cooling Optimization',
      category: 'energy',
      description: 'Pre-cool lecture halls using peak rooftop solar generation (11:00 - 13:00) to shave grid demand charges.',
      target: 'Chiller Plant 01 & Grand Hall 201',
      estimatedKwhSavings: 31.0,
      estimatedCostSavingsUsd: 74.20,
      estimatedCo2ReductionKg: 21.4,
      status: 'active',
      actionPayload: { action: 'pre_cool', targetFloor: 2 }
    }
  ];
  await repo.recommendations.insertMany(recommendationsData);

  // 6. Generate 24 hours of realistic historical telemetry
  const telemetryHistory = [];
  const now = new Date();
  const sampleRooms = ['room_304', 'room_301', 'room_201', 'room_401', 'room_104'];

  for (let h = 24; h >= 0; h--) {
    const timestamp = new Date(now.getTime() - h * 3600 * 1000);
    const hourOfDay = timestamp.getHours();

    // Diurnal factor (0 at 3 AM, peaks at 14:00)
    const diurnal = Math.max(0, Math.sin(((hourOfDay - 6) / 18) * Math.PI));
    const occupancyBase = hourOfDay >= 8 && hourOfDay <= 18 ? (hourOfDay === 12 || hourOfDay === 13 ? 12 : 38) : 2;

    for (const rId of sampleRooms) {
      const room = roomsData.find(r => r.id === rId);
      const isHeroRoom = rId === 'room_304';
      const occ = Math.round(occupancyBase * (isHeroRoom ? 1 : 0.8) + (Math.random() * 4 - 2));
      const temp = Number((23.0 + diurnal * 0.8 + (Math.random() * 0.4 - 0.2)).toFixed(1));
      const co2 = Math.round(440 + occ * 5 + Math.random() * 15);
      const hum = Math.round(44 + diurnal * 2 + Math.random() * 2);
      const hvacKw = Number((1.2 + occ * 0.08 + diurnal * 1.5).toFixed(2));

      telemetryHistory.push({
        roomId: rId,
        floorNumber: room.floorNumber,
        timestamp,
        temperature: temp,
        humidity: hum,
        co2,
        occupancy: occ,
        lightingLevel: occ > 0 ? 460 : 60,
        lightingState: occ > 0,
        hvacState: occ > 0 ? 'cooling' : 'idle',
        hvacPowerKw: hvacKw,
        doorStatus: occ > 0 ? 'closed' : 'closed',
        cctvStatus: 'online',
        roomEnergyKw: Number((hvacKw + (occ > 0 ? 0.6 : 0.1)).toFixed(2))
      });
    }
  }

  await repo.telemetry.insertMany(telemetryHistory);
  console.log(`✅ [Seed] Successfully seeded building with ${roomsData.length} rooms, ${equipmentData.length} equipment, and ${telemetryHistory.length} historical telemetry records.`);
}

// Direct execution when called via node
if (process.argv[1].endsWith('seedAcademic.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
