const express = require('express');
const app = express();
require('dotenv').config(); // Load environment variables
const studentRoutes = require("./src/routes/studentRoutes.js"); // Ensure this path is correct
const teacherRoutes = require("./src/routes/teacherRoutes.js");
require('./src/config/db.js'); // Ensure this is the correct path to your db connection file

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use student routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

// Basic route to test the server
app.get('/', (req, res) => {
    res.send("Hello World");
});

// Start the server on the specified port from environment variables
const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT is not set in .env
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
