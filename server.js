const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`🏠 User ${socket.id} joined ${roomId}`);
    // Notify others so they can "Request Sync"
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`👋 User ${socket.id} left ${roomId}`);
  });

  socket.on('sync-action', (data) => {
    const { roomId, type, payload } = data;
    // Log for debugging
    console.log(`🔄 Sync ${type} in ${roomId}:`, payload);
    socket.to(roomId).emit('sync-action', { type, payload });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});