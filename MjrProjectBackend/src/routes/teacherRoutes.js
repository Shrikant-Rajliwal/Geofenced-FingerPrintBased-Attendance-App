const express = require('express');
const app = express();
const {createTeacher ,loginTeacher} = require("../controllers/CreateTeacher"); 

app.post("/createTeacher",createTeacher);

app.post("/loginTeacher",loginTeacher);  // Route for logging in a teacher.  This is a POST request, not a GET request.

module.exports = app;  // Export the Express app for use in other files.  This allows other files to use the routes defined in this file.  Note that the path to the controller is relative to the current file.  If the controller is in a different directory, you would need to adjust the path accordingly.  This is a common practice in Node.js applications.  The controller should have the same name as the route, but in lowercase.  For example, if
