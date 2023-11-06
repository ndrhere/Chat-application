const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5500',
    methods: 'GET, POST',
    credentials: true
   }
app.use(cors(corsOptions)); // Enable CORS for all routes

const server = http.createServer(app);
const io = socketIo(server);

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', (userName) => {
    console.log("New user", userName);
    users[socket.id] = userName;
    socket.broadcast.emit('user-joined', userName);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, userName: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
