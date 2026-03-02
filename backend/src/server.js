require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const validateEnv = require('./config/env');
const socketio = require('socket.io');

// Validate environment variables
validateEnv();

const PORT = process.env.PORT || 5000;

// Keep track of delivery boy locations
const deliveryLocations = {};

connectDB()
  .then(() => {
    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = socketio(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // 🔥 ATTACH IO TO APP
    app.set('io', io);

    // Socket.IO connection
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Join delivery boy
      socket.on('joinDelivery', ({ userId }) => {
        socket.userId = userId;
        console.log(`Delivery boy ${userId} joined`);
      });

      // Update location
      socket.on('updateLocation', ({ userId, latitude, longitude }) => {
        deliveryLocations[userId] = { latitude, longitude };
        io.emit('deliveryLocationUpdate', { userId, latitude, longitude });
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (socket.userId) delete deliveryLocations[socket.userId];
      });
    });

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });

