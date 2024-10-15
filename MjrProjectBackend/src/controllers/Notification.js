const express = require('express');
const router = express.Router();
const Notification = require('../models/NotificationSchema');

// Controller function to send a notification
const sendNotification = async (req, res) => {
  const { title, message, year, division, subject } = req.body;

  try {
      const notification = new Notification({ title, message, year, division, subject });
      await notification.save();

      // Emit the notification via Socket.IO
      req.app.get('io').emit('notification', notification);

      res.status(201).json({ message: 'Notification sent successfully!' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to send notification' });
  }
};


// Controller function to get notifications for a specific year and section
const getNotification = async (req, res) => {
  const { year, division } = req.params; // Use division instead of section
  console.log(`Fetching notifications for Year: ${year}, Division: ${division}`);

  try {
      const notifications = await Notification.find({ year, division }); // Adjust here as well
      res.status(200).json(notifications);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};


module.exports = {
  sendNotification,
  getNotification,
};
