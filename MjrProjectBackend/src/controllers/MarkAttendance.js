const Attendance = require('../models/AttendanceSchema');
const Student = require('../models/StudentSchema');
const Notification = require('../models/NotificationSchema');

const MarkAttendance = async (req, res) => {
    console.log("Request Body Data =>", req.body);
    const { studentId, subject, division, notificationId, deviceId } = req.body;

    try {
        // Find the student by ID to get their details
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ 
                message: 'Student not found', 
                showPopup: true 
            });
        }

        // Check if the device ID matches the student's registered device
        if (student.deviceId !== deviceId) {
            return res.status(400).json({
                message: 'Attendance can only be marked from the registered device.',
                showPopup: true,
            });
        }

        // Check if attendance for this notification and student already exists
        const existingAttendance = await Attendance.findOne({
            studentId: student._id,
            subject,
            division,
            notificationId
        });

        if (existingAttendance) {
            return res.status(400).json({
                message: 'Attendance already marked for this notification.',
                showPopup: true,
            });
        }

        // Create a new attendance record
        const attendance = new Attendance({
            studentId: student._id,
            studentName: student.username,
            subject,
            division,
            prn: student.prn, // Add PRN from student record
            year: student.year,
        });

        await attendance.save();

        // Mark the notification as done
        if (notificationId) {
            const notification = await Notification.findById(notificationId);
            if (notification) {
                notification.attendanceMarked = true;
                await notification.save();
            }
        }

        res.status(200).json({ 
            message: 'Attendance marked successfully.', 
            showPopup: false 
        });

    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ 
            message: 'An error occurred while marking attendance.', 
            error,
            showPopup: true 
        });
    }
};

module.exports = { MarkAttendance };
