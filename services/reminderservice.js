const cron = require('node-cron');
const Reminder = require('../models/reminder');
const User = require('../models/User');
const Movie = require('../models/Movie');
const sendEmailNotification = require('./sendNotification'); // Email sending service

// Cron job to check reminders every minute
cron.schedule('*/1 * * * *', async () => {
  const currentTime = new Date();

  // Find all reminders that are due or passed
  const reminders = await Reminder.find({
    reminderDate: { $lte: currentTime },
  });

  console.log("reminder is running");
  for (let reminder of reminders) {
    const user = await User.findById(reminder.userId);
    const movie = await Movie.findById(reminder.movieId);

    if (!user || !movie) continue;

    let reminderType = reminder.type === 'release' ? 'Release Date' : 'Trailer Release';

    // Send the email notification to the user
    await sendEmailNotification(user, movie, reminderType);

    // Optionally, delete the reminder after sending the email
    await Reminder.deleteOne({ _id: reminder._id });
  }
});
module.exports = cron;