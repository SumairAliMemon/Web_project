const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  movieId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie', 
    required: true 
  },
  reviewText: { 
    type: String, 
    required: true, 
    trim: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  likes: { 
    type: Number, 
    default: 0  // Default to 0 likes initially
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
