const express = require('express');
const router = express.Router(); // Correct way to initialize a router
const {createStudent,loginStudent} = require('../controllers/CreateStudent'); // Adjust import to CommonJS style
const { markAttendance } = require('../controllers/MarkAttendance');



// Define route
router.post('/createStudent', createStudent);
router.post('/loginStudent', loginStudent);
router.post('/attendance/mark', markAttendance);  // New route for marking attendance

// Export the router
module.exports = router;
