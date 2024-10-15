const express = require('express');
const app = express();
const {createTeacher ,loginTeacher} = require("../controllers/CreateTeacher"); 
const { sendNotification } = require('../controllers/Notification');


app.post("/createTeacher",createTeacher);

app.post("/loginTeacher",loginTeacher);  // Route for logging in a teacher.  This is a POST request, not a GET request.

app.post("/sendNotification", sendNotification);  

module.exports = app;  

