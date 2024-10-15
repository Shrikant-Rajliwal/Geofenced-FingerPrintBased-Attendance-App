const Attendance = require('../models/AttendanceSchema');
const Student = require('../models/StudentSchema');
const Notification = require('../models/NotificationSchema'); // Import your notification model

const markAttendance = async (req, res) => {
    const { studentId, subject, division, notificationId } = req.body; // Expect notificationId to be sent in the request
    console.log(studentId, subject, division, notificationId);
    
    try {
        // Find the student by ID to get their details
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Create a new attendance record with the PRN
        const attendance = new Attendance({
            studentId: student._id,
            studentName: student.username,
            subject,
            division,
            prn: student.prn, // Add PRN from student record
            year: student.year
        });

        await attendance.save();

        // Update the notification to mark attendance as done
        if (notificationId) {
            const notification = await Notification.findById(notificationId);
            if (notification) {
                notification.attendanceMarked = true; // Set attendanceMarked to true
                await notification.save();
            }
        }

        res.status(200).json({ message: 'Attendance marked successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Error marking attendance', error });
    }
};

module.exports = { markAttendance };
