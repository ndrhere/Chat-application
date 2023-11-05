const express = require('express');
const http = require('http');
const socketIo = require('socket.io')
const cors = require('cors')

const app = express();
app.use(cors());

const server = http.createServer(app)
const io = socketIo(server)

const users = {};

 io.on('connection', (socket) => {
  socket.on('new-user-joined', (userName) => {
  console.log("New user", userName)
  users[socket.id] = userName;
  socket.broadcast.emit('user-joined', userName);
  //broadcast is used to broadcast all the other users except the current user about the event which has happened
  });

  socket.on('send', (message) => {
  socket.broadcast.emit('receive', {message: message, userName: users[socket.id]})
  });

  socket.on('disconnect', (message) => {
  socket.broadcast.emit('left', users[socket.id])
  delete users[socket.id]
  })


 })
 //io.on will handle all the chat connections in general where all the users will join 
 //socket.on is to handle the individual connection or a user which will join

 const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});