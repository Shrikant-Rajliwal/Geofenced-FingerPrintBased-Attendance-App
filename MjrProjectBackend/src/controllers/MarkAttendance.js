const Attendance = require('../models/AttendanceSchema');
const Student = require('../models/StudentSchema');

const markAttendance = async (req, res) => {
    const { studentId, subject, division } = req.body;
    console.log(studentId, subject, division );
    
    

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
        });

        await attendance.save();
        res.status(200).json({ message: 'Attendance marked successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Error marking attendance', error });
    }
};

module.exports = { markAttendance };
