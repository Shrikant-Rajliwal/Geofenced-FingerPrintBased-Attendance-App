const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentName: { type: String, required: true },
    subject: { type: String, required: true },
    division: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    prn: { type: String, required: true } // Add PRN here
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
