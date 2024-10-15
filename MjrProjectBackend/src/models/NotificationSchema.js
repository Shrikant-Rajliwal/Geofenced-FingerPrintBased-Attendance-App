const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    year: { type: String, required: true },  // e.g., "2024"
    division: { type: String, required: true }, // e.g., "A"
    subject: { type: String, required: true }, // Add this line for subject
    createdAt: { type: Date, default: Date.now },
    timestamp: { type: Date, default: Date.now }, // When the notification is created
    attendanceMarked: { type: Boolean, default: false } // Track if attendance is marked
});

module.exports = mongoose.model('Notification', notificationSchema);
