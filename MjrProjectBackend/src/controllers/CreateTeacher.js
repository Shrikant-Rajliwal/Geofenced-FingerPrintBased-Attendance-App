const Teacher = require("../models/TeacherChema"); // Ensure correct schema file name
const bcrypt = require("bcryptjs");

// Controller function to create a new teacher
const createTeacher = async (req, res) => {
  const { username, password, mobile, email } = req.body;

  // Check if all required fields are present
  if (!password || typeof password !== 'string') {
    return res.status(400).send({ message: "Invalid or missing password" });
  }

  // Hash the password
  const encryptedPass = await bcrypt.hash(password, 10);

  try {
    await Teacher.create({
      username,
      password: encryptedPass,
      mobile,
      email,
    });

    res.status(201).send({ message: "Teacher created successfully", status: "OK" });
  } catch (error) {
    console.error("Error creating teacher:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Controller function for teacher login
const loginTeacher = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ mobile });
    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid password" });
    }

    res.status(200).send({ message: "Teacher logged in successfully", status: "OK" });
  } catch (error) {
    console.error("Error during teacher login:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { createTeacher, loginTeacher };
