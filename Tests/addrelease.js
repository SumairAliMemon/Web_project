// addIsReleasedField.js

const mongoose = require('mongoose');
const Movie = require('../models'); // Path to your Movie model

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/A03', { // Replace with your DB URI
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to the database');
  
  // Update all movies that do not have an `isReleased` field
  return Movie.updateMany(
    { isReleased: { $exists: false } },  // Check for movies without `isReleased`
    { $set: { isReleased: false } }      // Set `isReleased` to `false` for them
  );
})
.then(result => {
  console.log('Movies updated:', result);
  mongoose.disconnect();  // Disconnect from the database after the operation
})
.catch(err => {
  console.error('Error updating movies:', err);
  mongoose.disconnect();  // Disconnect in case of an error
});
