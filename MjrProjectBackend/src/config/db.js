const mongoose = require('mongoose');

// Your MongoDB connection URI
const mongoUrl = "mongodb+srv://shrikantnrajniwal0404:6DjRXnz9DZA9B5z9@cluster0.zfauo.mongodb.net/MajorProject?retryWrites=true&w=majority"; // Replace with your actual URI

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(err => {
    console.error("Error connecting to the database: ", err);
  });
