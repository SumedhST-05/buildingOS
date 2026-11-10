import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import { seedDatabase } from './seed/seedAcademic.js';
import { academicSimulator } from './simulator/academicSimulator.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'BuildingOS Core Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 [Socket.io] Client connected: ${socket.id}`);

  // Send immediate initial sync
  socket.emit('connection:ack', {
    status: 'connected',
    message: 'Connected to BuildingOS Real-time Telemetry Stream'
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Bootstrapping
async function bootstrap() {
  try {
    await connectDB();
    await seedDatabase();
    await academicSimulator.initialize(io);
    academicSimulator.start();

    server.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🏢  BuildingOS Backend Server running on port ${PORT}`);
      console.log(`📡  Socket.io real-time streaming at ws://localhost:${PORT}`);
      console.log(`🔗  REST API available at http://localhost:${PORT}/api`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('❌ [Server] Fatal bootstrap error:', err);
    process.exit(1);
  }
}

bootstrap();
