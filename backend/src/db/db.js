import mongoose from 'mongoose';

// In-Memory Fallback Storage
class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.documents = [];
  }

  async find(filter = {}) {
    return this.documents.filter(doc => {
      for (const key of Object.keys(filter)) {
        if (doc[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    const results = await this.find(filter);
    return results[0] || null;
  }

  async findById(id) {
    return this.documents.find(doc => doc._id === id || doc.id === id) || null;
  }

  async insertOne(doc) {
    const record = {
      _id: doc._id || doc.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      ...doc
    };
    this.documents.push(record);
    return record;
  }

  async insertMany(docs) {
    return Promise.all(docs.map(d => this.insertOne(d)));
  }

  async updateOne(filter, update) {
    const doc = await this.findOne(filter);
    if (!doc) return { modifiedCount: 0 };
    const updates = update.$set || update;
    Object.assign(doc, updates, { updatedAt: new Date() });
    return { modifiedCount: 1, document: doc };
  }

  async countDocuments(filter = {}) {
    const docs = await this.find(filter);
    return docs.length;
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      const count = this.documents.length;
      this.documents = [];
      return { deletedCount: count };
    }
    const initial = this.documents.length;
    this.documents = this.documents.filter(doc => {
      for (const key of Object.keys(filter)) {
        if (doc[key] === filter[key]) return false;
      }
      return true;
    });
    return { deletedCount: initial - this.documents.length };
  }
}

export const inMemoryDB = {
  buildings: new InMemoryCollection('buildings'),
  floors: new InMemoryCollection('floors'),
  rooms: new InMemoryCollection('rooms'),
  equipment: new InMemoryCollection('equipment'),
  telemetry: new InMemoryCollection('telemetry'),
  alerts: new InMemoryCollection('alerts'),
  predictions: new InMemoryCollection('predictions'),
  simulations: new InMemoryCollection('simulations'),
  recommendations: new InMemoryCollection('recommendations'),
};

let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildingos';
  console.log('[DB] Connecting to MongoDB at', uri, '...');

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log('✅ [DB] Connected to MongoDB successfully.');
  } catch (err) {
    isMongoConnected = false;
    console.warn('⚠️ [DB] MongoDB unreachable. Auto-activated resilient In-Memory Database store.');
    console.log('ℹ️ [DB] All BuildingOS features, seeding, and real-time streaming will operate with in-memory persistence.');
  }
}

export function isUsingMongo() {
  return isMongoConnected;
}
