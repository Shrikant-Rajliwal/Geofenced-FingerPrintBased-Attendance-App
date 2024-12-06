const Attendance = require('../models/AttendanceSchema');
const Student = require('../models/StudentSchema');
const Notification = require('../models/NotificationSchema');

const MarkAttendance = async (req, res) => {
    console.log("Request Body Data =>", req.body);
    const { studentId, subject, division, notificationId, deviceId } = req.body;

    try {
        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            console.log("Student not found for ID:", studentId);
            return res.status(404).json({ 
                message: 'Student not found.', 
                showPopup: true 
            });
        }

        // Check if the device ID matches
        console.log("Registered Device ID:", student.deviceId, "| Provided Device ID:", deviceId);
        if (student.deviceId !== deviceId) {
            return res.status(400).json({
                message: 'Your device is not authorized to mark attendance. Please contact your instructor for assistance.',
                showPopup: true,
            });
        }

        // Check if attendance already exists
        const existingAttendance = await Attendance.findOne({
            studentId: student._id,
            subject,
            division,
            notificationId
        });
        if (existingAttendance) {
            console.log("Attendance already marked for:", { studentId, subject, division, notificationId });
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
            prn: student.prn,
            year: student.year,
        });
        await attendance.save();

        // Update notification (if provided)
        if (notificationId) {
            const notification = await Notification.findById(notificationId);
            if (notification) {
                notification.attendanceMarked = true;
                await notification.save();
            }
        }

        // Success response
        return res.status(200).json({ 
            message: 'Attendance marked successfully.', 
            showPopup: false 
        });

    } catch (error) {
        console.error("Error marking attendance:", error.message);
        res.status(500).json({ 
            message: 'Failed to mark attendance. Please try again.', 
            error: error.message,
            showPopup: true 
        });
    }
};

module.exports = { MarkAttendance };
