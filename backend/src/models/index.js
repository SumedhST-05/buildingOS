import mongoose from 'mongoose';
import { inMemoryDB, isUsingMongo } from '../db/db.js';

// --- Mongoose Schemas ---
const buildingSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  campus: String,
  totalFloors: Number,
  totalAreaSqFt: Number,
  totalCameras: Number,
  activeCameras: Number,
  perimeterStatus: String
}, { timestamps: true });

const floorSchema = new mongoose.Schema({
  id: String,
  floorNumber: Number,
  name: String,
  buildingId: String,
  elevationY: Number,
  areaSqFt: Number
}, { timestamps: true });

const roomSchema = new mongoose.Schema({
  id: String,
  roomNumber: String,
  name: String,
  floorNumber: Number,
  category: String, // classroom, lab, library, server_room, office, dining, facilities, stairwell, elevator
  capacity: Number,
  areaSqFt: Number,
  x: Number,
  z: Number,
  width: Number,
  depth: Number,
  height: Number,
  targetTemp: Number,
  targetHumidity: Number,
  targetCo2: Number,
  targetLux: Number,
  status: { type: String, default: 'optimal' } // optimal, warning, critical
}, { timestamps: true });

const equipmentSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String, // hvac_chiller, ahu, elevator, solar_inverter, lighting_controller
  floorNumber: Number,
  roomId: String,
  status: { type: String, default: 'healthy' }, // healthy, degraded, critical
  healthScore: Number, // 0 - 100
  ttfHours: Number,
  powerKw: Number
}, { timestamps: true });

const telemetrySchema = new mongoose.Schema({
  roomId: String,
  floorNumber: Number,
  timestamp: Date,
  temperature: Number,
  humidity: Number,
  co2: Number,
  occupancy: Number,
  lightingLevel: Number,
  lightingState: Boolean,
  hvacState: String, // cooling, heating, idle, fault
  hvacPowerKw: Number,
  doorStatus: String, // closed, open, forced
  cctvStatus: String, // online, offline, degraded
  roomEnergyKw: Number
}, { timestamps: true });

const alertSchema = new mongoose.Schema({
  id: String,
  timestamp: Date,
  roomId: String,
  roomNumber: String,
  roomName: String,
  floorNumber: Number,
  equipmentId: String,
  severity: String, // info, warning, critical
  category: String, // hvac, air_quality, security, energy
  title: String,
  message: String,
  recommendedAction: String,
  resolved: { type: Boolean, default: false },
  resolvedAt: Date
}, { timestamps: true });

const recommendationSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  description: String,
  target: String,
  estimatedKwhSavings: Number,
  estimatedCostSavingsUsd: Number,
  estimatedCo2ReductionKg: Number,
  status: { type: String, default: 'active' }, // active, applied
  actionPayload: mongoose.Schema.Types.Mixed
}, { timestamps: true });

// Models
const BuildingModel = mongoose.models.Building || mongoose.model('Building', buildingSchema);
const FloorModel = mongoose.models.Floor || mongoose.model('Floor', floorSchema);
const RoomModel = mongoose.models.Room || mongoose.model('Room', roomSchema);
const EquipmentModel = mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
const TelemetryModel = mongoose.models.Telemetry || mongoose.model('Telemetry', telemetrySchema);
const AlertModel = mongoose.models.Alert || mongoose.model('Alert', alertSchema);
const RecommendationModel = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);

// Universal Repository Interface (Transparently handles Mongoose OR in-memory fallback)
export const repo = {
  buildings: {
    find: async (filter = {}) => isUsingMongo() ? BuildingModel.find(filter).lean() : inMemoryDB.buildings.find(filter),
    findOne: async (filter = {}) => isUsingMongo() ? BuildingModel.findOne(filter).lean() : inMemoryDB.buildings.findOne(filter),
    create: async (data) => isUsingMongo() ? (await BuildingModel.create(data)).toObject() : inMemoryDB.buildings.insertOne(data),
    insertMany: async (items) => isUsingMongo() ? BuildingModel.insertMany(items) : inMemoryDB.buildings.insertMany(items),
    deleteMany: async (filter = {}) => isUsingMongo() ? BuildingModel.deleteMany(filter) : inMemoryDB.buildings.deleteMany(filter)
  },
  floors: {
    find: async (filter = {}) => isUsingMongo() ? FloorModel.find(filter).sort({ floorNumber: 1 }).lean() : inMemoryDB.floors.find(filter),
    findOne: async (filter = {}) => isUsingMongo() ? FloorModel.findOne(filter).lean() : inMemoryDB.floors.findOne(filter),
    create: async (data) => isUsingMongo() ? (await FloorModel.create(data)).toObject() : inMemoryDB.floors.insertOne(data),
    insertMany: async (items) => isUsingMongo() ? FloorModel.insertMany(items) : inMemoryDB.floors.insertMany(items),
    deleteMany: async (filter = {}) => isUsingMongo() ? FloorModel.deleteMany(filter) : inMemoryDB.floors.deleteMany(filter)
  },
  rooms: {
    find: async (filter = {}) => isUsingMongo() ? RoomModel.find(filter).lean() : inMemoryDB.rooms.find(filter),
    findOne: async (filter = {}) => isUsingMongo() ? RoomModel.findOne(filter).lean() : inMemoryDB.rooms.findOne(filter),
    create: async (data) => isUsingMongo() ? (await RoomModel.create(data)).toObject() : inMemoryDB.rooms.insertOne(data),
    insertMany: async (items) => isUsingMongo() ? RoomModel.insertMany(items) : inMemoryDB.rooms.insertMany(items),
    updateOne: async (filter, update) => isUsingMongo() ? RoomModel.updateOne(filter, update) : inMemoryDB.rooms.updateOne(filter, update),
    deleteMany: async (filter = {}) => isUsingMongo() ? RoomModel.deleteMany(filter) : inMemoryDB.rooms.deleteMany(filter)
  },
  equipment: {
    find: async (filter = {}) => isUsingMongo() ? EquipmentModel.find(filter).lean() : inMemoryDB.equipment.find(filter),
    findOne: async (filter = {}) => isUsingMongo() ? EquipmentModel.findOne(filter).lean() : inMemoryDB.equipment.findOne(filter),
    create: async (data) => isUsingMongo() ? (await EquipmentModel.create(data)).toObject() : inMemoryDB.equipment.insertOne(data),
    insertMany: async (items) => isUsingMongo() ? EquipmentModel.insertMany(items) : inMemoryDB.equipment.insertMany(items),
    updateOne: async (filter, update) => isUsingMongo() ? EquipmentModel.updateOne(filter, update) : inMemoryDB.equipment.updateOne(filter, update),
    deleteMany: async (filter = {}) => isUsingMongo() ? EquipmentModel.deleteMany(filter) : inMemoryDB.equipment.deleteMany(filter)
  },
  telemetry: {
    find: async (filter = {}, limit = 50) => isUsingMongo() ? TelemetryModel.find(filter).sort({ timestamp: -1 }).limit(limit).lean() : (await inMemoryDB.telemetry.find(filter)).slice(-limit),
    insertMany: async (items) => isUsingMongo() ? TelemetryModel.insertMany(items) : inMemoryDB.telemetry.insertMany(items),
    insertOne: async (item) => isUsingMongo() ? TelemetryModel.create(item) : inMemoryDB.telemetry.insertOne(item),
    deleteMany: async (filter = {}) => isUsingMongo() ? TelemetryModel.deleteMany(filter) : inMemoryDB.telemetry.deleteMany(filter)
  },
  alerts: {
    find: async (filter = {}) => isUsingMongo() ? AlertModel.find(filter).sort({ timestamp: -1 }).lean() : (await inMemoryDB.alerts.find(filter)).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)),
    create: async (data) => isUsingMongo() ? (await AlertModel.create(data)).toObject() : inMemoryDB.alerts.insertOne(data),
    updateOne: async (filter, update) => isUsingMongo() ? AlertModel.updateOne(filter, update) : inMemoryDB.alerts.updateOne(filter, update),
    deleteMany: async (filter = {}) => isUsingMongo() ? AlertModel.deleteMany(filter) : inMemoryDB.alerts.deleteMany(filter)
  },
  recommendations: {
    find: async (filter = {}) => isUsingMongo() ? RecommendationModel.find(filter).lean() : inMemoryDB.recommendations.find(filter),
    create: async (data) => isUsingMongo() ? (await RecommendationModel.create(data)).toObject() : inMemoryDB.recommendations.insertOne(data),
    insertMany: async (items) => isUsingMongo() ? RecommendationModel.insertMany(items) : inMemoryDB.recommendations.insertMany(items),
    updateOne: async (filter, update) => isUsingMongo() ? RecommendationModel.updateOne(filter, update) : inMemoryDB.recommendations.updateOne(filter, update),
    deleteMany: async (filter = {}) => isUsingMongo() ? RecommendationModel.deleteMany(filter) : inMemoryDB.recommendations.deleteMany(filter)
  }
};
