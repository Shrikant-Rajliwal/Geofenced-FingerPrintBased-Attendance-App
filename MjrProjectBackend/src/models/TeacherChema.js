const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({

    username:{
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
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regular expression for validating email format
        lowercase: true, // Convert the email to lowercase before saving it
      },

      password: {
        type: String,
        required: true,
      },
});

module.exports = mongoose.model('Teacher', TeacherSchema);

