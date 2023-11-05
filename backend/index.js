const io = require('socket.io')('https://chat-application-one-green.vercel.app');


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

 console.log('Socket.IO server is running on port 5000');
