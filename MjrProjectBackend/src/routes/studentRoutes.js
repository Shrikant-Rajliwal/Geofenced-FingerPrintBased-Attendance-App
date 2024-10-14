const express = require('express');
const router = express.Router(); // Correct way to initialize a router
const {createStudent,loginStudent} = require('../controllers/CreateStudent'); // Adjust import to CommonJS style
const { markAttendance } = require('../controllers/MarkAttendance');
const { getNotification } = require('../controllers/Notification');



// Define route
router.post('/createStudent', createStudent);
router.post('/loginStudent', loginStudent);
router.post('/attendance/mark', markAttendance);  // New route for marking attendance
router.get('/getNotification/:year/:division', getNotification); // New route for getting notifications


// Export the router
module.exports = router;
