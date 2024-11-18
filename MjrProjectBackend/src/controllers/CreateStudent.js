const Student = require('../models/StudentSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controller function to create a new student
const createStudent = async (req, res) => {
  const { username, prn, password, mobile, division, year ,deviceId} = req.body; // Add year and section
  
  console.log(deviceId);
  
  // console.log('Received data:', req.body); // Log incoming data for debugging

  // Validate password
  if (!password || typeof password !== 'string') {
    return res.status(400).send({ message: 'Invalid or missing password' });
  }

  try {
    // Check if the PRN or mobile already exists
    const oldUserByMobile = await Student.findOne({ mobile });
    const oldUserByPRN = await Student.findOne({ prn });

    if (oldUserByMobile || oldUserByPRN) {
      return res
        .status(400)
        .send({ message: 'User with this mobile or PRN already exists' });
    }

    // Hash password
    const encryptedPass = await bcrypt.hash(password, 10);

    // Create the student
    await Student.create({
      username,
      prn,
      password: encryptedPass,
      mobile,
      division,
      year,
      deviceId    // Store deviceId
    });

    res
      .status(201)
      .send({ message: 'User created successfully', status: 'OK' });
  } catch (e) {
    console.error(e); // Log the error for debugging
    res.status(500).send({ error: e.message });
  }
};

// Controller function for student login
const loginStudent = async (req, res) => {
  const { prn, password } = req.body;

  try {
    // Check if the user exists by PRN
    const user = await Student.findOne({ prn });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const studentId = user._id; // Only passing the studentId
    const year = user.year;     // Add year from the user object
    const division = user.division; // Add section from the user object

    console.log('StudentId:', studentId);

    // Send the studentId, year, and section with the response
    res.status(200).send({
      message: 'Login successful',
      studentId,  // Return studentId
      year,       // Return year
      division,    // Return section
    });
  } catch (e) {
    console.error(e); // Log the error for debugging
    res.status(500).send({ error: e.message });
  }
};

module.exports = { createStudent, loginStudent };