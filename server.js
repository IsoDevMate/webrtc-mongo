// index.js
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);
const Room = require('./schema'); // Import the MongoDB schema
const db = require('./db'); // Import the database connection

io.on('connection', socket => {
  socket.on('join room', async roomID => {
    try {
      // Find or create a room in the database
      let room = await Room.findOne({ roomID });

      if (!room) {
        room = new Room({ roomID, users: [socket.id] });
        await room.save();
      } else {
        room.users.push(socket.id);
        await room.save();
      }

      const otherUser = room.users.find(id => id !== socket.id);

      if (otherUser) {
        socket.emit('other user', otherUser);
        socket.to(otherUser).emit('user joined', socket.id);
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  // Socket event handlers for WebRTC signaling
  socket.on('offer', payload => {
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', payload => {
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', incoming => {
    io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  });
});

server.listen(8000, () => console.log('Server is running on port 8000'));
