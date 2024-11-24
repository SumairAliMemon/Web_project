const express = require('express');
const router = express.Router();
const reminderController = require('../Controller/remindercontoller');
const {authMiddleware} = require('../middleware/middleware');

// Route to set a reminder
router.post('/set', authMiddleware, reminderController.createReminder);

// Route to get all reminders for a user
router.get('/', authMiddleware, reminderController.getUserReminders);


router.get('/upcomingmoives',authMiddleware, reminderController.getUpcomingMovies);
module.exports = router;
