const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
require('dotenv').config();
const studentRoutes = require("./src/routes/studentRoutes.js");
const teacherRoutes = require("./src/routes/teacherRoutes.js");
require('./src/config/db.js');

app.use(express.json());

// Create the HTTP server and bind the Express app to it
const server = http.createServer(app);

// Initialize Socket.IO and bind it to the HTTP server
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Attach Socket.IO instance to app
app.set('io', io); // Store Socket.IO instance in the app

// Use student and teacher routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

// Basic route to test the server
app.get('/', (req, res) => {
    res.send("Hello World");
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server on the specified port from environment variables
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
