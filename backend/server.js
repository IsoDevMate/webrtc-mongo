// index.js

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);
const Room = require('./schema'); // Import the MongoDB schema
const{connectDB} = require('./db'); // Import the MongoDB connection function
const PORT = process.env.PORT || 3000;
const  dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

//render the view
app.set("view engine", "ejs");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Connect to MongoDB
connectDB();  



io.on('connection', socket => {
  console.log('A user connected:', socket.id);

  socket.on('join room', async roomID => {
    console.log('A user is trying to join a room:', roomID);

    try {
      // Find or create a room in the database
      let room = await Room.findOne({ roomID });

      if (!room) {
        console.log('Room not found, creating a new room:', roomID);
        room = new Room({ roomID, users: [socket.id] });
        await room.save();
      } else {
        console.log('Room found, adding user to the room:', roomID);
        room.users.push(socket.id);
        await room.save();
      }

      const otherUser = room.users.find(id => id !== socket.id);

      if (otherUser) {
        console.log('Other user found in the room:', otherUser);
        socket.emit('other user', otherUser);
        socket.to(otherUser).emit('user joined', socket.id);
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  // Socket event handlers for WebRTC signaling
  socket.on('offer', payload => {
    console.log('Received an offer from:', payload.caller);
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', payload => {
    console.log('Received an answer from:', payload.caller);
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', incoming => {
    console.log('Received an ICE candidate from:', incoming.caller);
    io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  });
});

const { v4: uuidv4 } = require("uuid");

app.use(express.static('public'));

app.get("/", (req, res) => {
    const roomID = uuidv4();
    console.log('Redirecting to a new room:', roomID);
    res.redirect(`/${roomID}`);
});

//join room
app.get("/:room", (req, res) => {
    console.log('Rendering room:', req.params.room);
    res.render("room", { roomId: req.params.room });
});

server.listen(PORT, () => console.log(`socket Server is running on ${PORT}`));
