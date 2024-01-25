


const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
//const io = socket(server);
const Room = require('./schema'); // Import the MongoDB schema
const{connectDB} = require('./db'); // Import the MongoDB connection function
const PORT = process.env.PORT || 5000;
const  dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const { v4: uuidv4 } = require("uuid");


const io = socket(server, {
  cors: {
    origin: "*",  // Allow all origins
    methods: ["GET", "POST"]  // Allow only GET and POST request methods
  }
});


//render the view
//app.set("view engine", "ejs");

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/*
const corsOptions = {
  origin: "*",// Or whichever origin you want to allow
  methods: ['GET', 'POST'], // Or whichever methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization',"Access-Control-Allow-Origin": "*",], // Or whichever headers you want to allow
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
};*/

//app.use(cors(corsOptions));



// Connect to MongoDB
connectDB();  



//app.use(express.static('public'));

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


io.on('connection', socket => {
  console.log('A user connected:', socket.id);
 
  socket.on('join room', async (roomID) => {
    console.log('A user is trying to join a room:', roomID);
  //socket.join(roomID);
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
        console.log('Room ID:', room.roomID, ', Number of users in the room:', room.users.length);
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

  socket.on('disconnect', async () => {
    console.log('A user disconnected:', socket.id);
  
    try {
      // Find the room the user is in
      let room = await Room.findOne({ users: socket.id });
  
      if (room) {
        console.log('Room found, removing user from the room:', room.roomID);
  
        // Remove the user from the room
        room.users = room.users.filter(id => id !== socket.id);
        await room.save();
        console.log('Room ID:', room.roomID, ', Number of users left in the room:', room.users.length);
        // Notify the other users in the room
        room.users.forEach(userId => {
          socket.to(userId).emit('user disconnected', socket.id);
        });
      }
    } catch (error) {
      console.error('Error disconnecting user:', error);
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



server.listen(PORT, () => console.log(`socket Server is running on ${PORT}`));
