const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { PORT } = require('./config/env');
const seedDatabase = require('./utils/seeder');
const { Server } = require('socket.io');

const server = http.createServer(app);

// Socket.io for real-time citizen-volunteer updates
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_citizen_room', (citizenId) => {
    socket.join(`citizen_${citizenId}`);
  });

  socket.on('volunteer_broadcast', (data) => {
    io.emit('new_volunteer_activity', data);
  });

  socket.on('disconnect', () => {
    // disconnected
  });
});

// Start Server
const startServer = async () => {
  try {
    // Attempt DB connection and seed initial verified government schemes
    await connectDB();
    await seedDatabase();

    server.listen(PORT, () => {
      console.log(`======================================================`);
      console.log(`🚀 BOLO API Server is running on port: ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}/api/health`);
      console.log(`🇮🇳 Voice Help for Everyday Government Services`);
      console.log(`======================================================`);
    });
  } catch (error) {
    console.error(`[Server Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});
