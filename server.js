// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Allow all connections (Dev only)
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // 1. Join a specific room (e.g., your unique couple code)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Notify others in room
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  // 2. Sync Events
  // When YOU press play, we tell HER to play
  socket.on('sync-action', (data) => {
    const { roomId, type, payload } = data;
    // Broadcast to everyone ELSE in the room
    socket.to(roomId).emit('sync-action', { type, payload });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});