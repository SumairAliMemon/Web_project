const Reminder = require('../models/reminder');
const Movie = require('../models/Movie');
const User = require('../models/User');

// Create a reminder
exports.createReminder = async (req, res) => {
  try {
    // Get userId from the authenticated user (set by authMiddleware)
    const { movieId, reminderDate, reminderType } = req.body;
    const userId = req.user.id; // User ID from the auth token

    // Check if the necessary fields are provided in the body
    if (!movieId || !reminderDate || !reminderType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the movie and user (userId is already available from authMiddleware)
    const movie = await Movie.findById(movieId);
    const user = await User.findById(userId);

    if (!movie || !user) {
      return res.status(404).json({ message: 'Movie or User not found' });
    }

    // Check if the movie is upcoming
    if (movie.isReleased) {
      return res.status(400).json({ message: 'Reminder can only be set for upcoming movies' });
    }

    // Check if a reminder already exists for this user and movie
    const existingReminder = await Reminder.findOne({ userId, movieId });
    if (existingReminder) {
      return res.status(400).json({ message: 'Reminder already exists for this movie' });
    }

    // Create a new reminder
    const reminder = new Reminder({
      userId,
      movieId,
      reminderDate: new Date(reminderDate), // Convert to Date object
      type: reminderType,
    });

    // Save the reminder to the database
    await reminder.save();

    return res.status(201).json({ message: 'Reminder set successfully', reminder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error setting reminder' });
  }
};


// Get all reminders for a user (for viewing or managing reminders)

// Get all reminders for a user (for viewing or managing reminders)
exports.getUserReminders = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from the auth token

    // Find all reminders for the authenticated user
    const reminders = await Reminder.find({ userId });

    if (!reminders || reminders.length === 0) {
      return res.status(404).json({ message: 'No reminders found' });
    }

    return res.status(200).json(reminders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching reminders' });
  }
};




// Get upcoming movies (movies that are not released yet)
exports.getUpcomingMovies = async (req, res) => {
  try {
    const upcomingMovies = await Movie.find({ isReleased: false });

    if (!upcomingMovies.length) {
      return res.status(404).json({ message: 'No upcoming movies found' });
    }

    return res.status(200).json(upcomingMovies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching upcoming movies' });
  }
};
