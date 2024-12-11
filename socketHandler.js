let users = {}; // Store users by socket ID
let messages = {}; // Store messages by room

// Function to handle socket.io events
const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', ({ name, room }) => {
      socket.join(room);
      users[socket.id] = { name, room };

      // Initialize message list for the room if it doesn't exist
      if (!messages[room]) messages[room] = [];

      const joinMessage = { id: generateId(), text: `${name} has joined the room`, sender: 'New' };
      messages[room].push(joinMessage);
      
      // Emit join message and update users
      io.in(room).emit('chat message', joinMessage);
      io.in(room).emit('update users', getUsersInRoom(room));
    });

    socket.on('chat message', ({ message, room }) => {
      if (users[socket.id] && users[socket.id].name) {
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const msg = { id: generateId(), text: `${message}`, time: `${formattedTime}`, sender: users[socket.id].name };
        
        // Save the message in memory for the room
        messages[room].push(msg);

        // Emit the message to all clients in the room
        io.in(room).emit('chat message', msg);
      } else {
        console.error(`User with socket ID ${socket.id} is not defined or has no name.`);
      }
    });

    // Delete message event
    socket.on('delete message', ({ messageId, room }) => {
      if (users[socket.id]) {
        // Filter out the message by ID for the specific room
        messages[room] = messages[room].filter(msg => msg.id !== messageId);

        // Emit delete message event to all clients in the room
        io.in(room).emit('delete message', messageId);
      }
    });

    socket.on('typing', (room) => {
      if (users[socket.id]) {
        socket.to(room).emit('typing', users[socket.id].name);
      }
    });

    // Function to handle user leaving the chat
    const handleUserLeave = (name, room) => {
      const leaveMessage = { id: generateId(), text: `${name} has left the chat`, sender: 'Left' };
      
      // Notify other users
      io.in(room).emit('chat message', leaveMessage);
      io.in(room).emit('update users', getUsersInRoom(room));
    };

    // Handle user leave event
    socket.on('leave', () => {
      const { name, room } = users[socket.id] || {};
      if (name && room) {
        // Remove user from memory
        delete users[socket.id];

        // Handle user leaving
        handleUserLeave(name, room);
      }
    });

    // Handle user disconnection event
    socket.on('disconnect', () => {
      const { name, room } = users[socket.id] || {};
      if (name && room) {
        // Remove user from memory
        delete users[socket.id];

        // Handle disconnection
        handleUserLeave(name, room);
      }
      console.log('A user disconnected');
    });
  });
};

// Utility function to get users in a specific room
const getUsersInRoom = (room) => {
  return Object.values(users).filter(user => user.room === room).map(user => user.name);
};

// Utility function to generate a unique message ID
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

module.exports = socketHandler;






