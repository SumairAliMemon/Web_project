const mongoose = require('mongoose');

// Reminder schema to store reminders for movies
const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  reminderDate: { type: Date }, // Date when the user wants the reminder
  type: { type: String, enum: ['release', 'trailer'], required: true }, // Reminder for movie release or trailer
}, { timestamps: true });

// Correct CommonJS export
const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;  // Export Reminder model
