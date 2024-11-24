const mongoose = require('mongoose');

// Assuming a Movie schema exists like this:
const Movie = require('./Movie');  // Make sure to import your Movie model

const CustomListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [] // Initialize followers as an empty array by default
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // Reference to the Movie model
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Referencing the Movie collection
    default: []
  }]
});

const CustomList = mongoose.model('CustomList', CustomListSchema);
module.exports = CustomList;
