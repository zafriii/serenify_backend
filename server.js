require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require("./utils/db");
const authRouter = require("./router/auth-router");
const blogRouter = require('./router/noteRouter');
const postRouter = require('./router/postRouter');
const commentRouter = require('./router/commentRouter');
const replyRouter = require('./router/replyRouter');
const reactiontRouter = require('./router/reactionRouter');
const cmntreactiontRouter = require('./router/cmntreactionRouter');
const replyreactiontRouter = require('./router/rplyreactionRouter');
const feedbackRouter = require('./router/feedbackRouter');
const errorMiddleware = require("./middlewares/error-middleware");
const socketHandler = require('./socketHandler'); // Import your socket handler



const notificationRouter = require('./router/notificationRouter');

const alertRouter = require('./router/alertRouter');

const appointmentRouter = require('./router/appointmentRouter');
const moodRouter = require('./router/moodRouter');

const app = express();
const server = http.createServer(app); // Create the server for both HTTP and WebSocket connections

// Socket.io setup
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origins: "*:*", // Adjust as needed (e.g., frontend server URL)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    pingInterval: 25000, // Ping clients every 25 seconds
    pingTimeout: 60000,  // Disconnect clients if no pong received within 60 seconds
  },
});

// Use the socketHandler for handling socket.io events
socketHandler(io); // Pass the Socket.io instance to the handler



// Middleware for CORS
const corsOptions = {
  origin: "https://serenifymentalwellness.netlify.app", // Adjust according to the frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
};
app.use(cors(corsOptions));

// Middleware for parsing JSON and static files
app.use(express.json());
app.use(express.static('dist'));

// Connect routes for authentication and blogs
app.use("/api/auth", authRouter);
app.use('/api/notes', blogRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/replies', replyRouter);
app.use('/api/reactions', reactiontRouter);
app.use('/api/cmntreactions', cmntreactiontRouter);
app.use('/api/replyreactions', replyreactiontRouter);
app.use('/api/feedback', feedbackRouter);

app.use('/api/notifications', notificationRouter);

app.use('/api/alerts', alertRouter);

app.use('/api/appointments', appointmentRouter);

app.use('/api/moods',moodRouter );

// Middleware for handling errors
app.use(errorMiddleware);

// Database connection and starting the server
const PORT = 5000;
// connectDB().then(() => {
//   server.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
//   });
// }).catch((error) => {
//   console.error("Database connection failed:", error);
// });


connectDB().then(() => {
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

})


