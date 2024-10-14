const mongoose = require('mongoose');

// Define the schema for the Student
const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  prn: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  year: {
    type: String,
    required: true,
    enum: ['FE', 'SE', 'TE', 'BE'], // Only allow valid year values
  },
  division: {
    type: String,
    required: true,
    trim: true, // Ensure there's no accidental white space
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Add createdAt and updatedAt timestamps
});

// Create a model from the schema
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
