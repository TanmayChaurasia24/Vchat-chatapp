// Require necessary modules
const http = require('http');
const { Server } = require('socket.io');

// Create a HTTP server
const server = http.createServer();

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow requests from any origin (Update this as needed)
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    credentials: true // Allow sending credentials
  }
});

// Object to store user information
const users = {};

// Listen for connection events
io.on('connection', socket => {
  // Listen for 'new-user-add' event
  socket.on('new-user-add', name => {
    // console.log("new user: ",name)
    users[socket.id] = name;
    // Broadcast 'user-joined' event to all clients except the sender
    socket.broadcast.emit('user-joined', name);
  });

  // Listen for 'send' event
  socket.on('send', message => {
    // Broadcast 'receive' event to all clients except the sender
    socket.broadcast.emit('receive', {
      message: message,
      name: users[socket.id]
    });
  });

  // Listen for disconnection events
  socket.on('disconnect', () => {
    // console.log('A user disconnected:', socket.id);
    socket.broadcast.emit('left',users[socket.id])
    // Remove the user from the users object
    delete users[socket.id];
  });
});

// Start the HTTP server
server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
