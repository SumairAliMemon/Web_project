const Review = require('../models/review');
const Movie = require('../models/Movie');

// Add a new review (User)
exports.addReview = async (req, res) => {
  const { movieId, rating, reviewText } = req.body;
  const userId = req.user.id;

  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    const newReview = new Review({ movieId, userId, reviewText, rating });
    await newReview.save();

    await updateAverageRating(movieId);
    res.json({ msg: 'Review added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a review (User - only their own)
exports.updateReview = async (req, res) => {
  const { reviewId, rating, reviewText } = req.body;
  const userId = req.user.id;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ msg: 'You can only update your own reviews' });
    }

    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;
    await review.save();

    await updateAverageRating(review.movieId);
    res.json({ msg: 'Review updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all reviews for a movie
exports.getMovieReviews = async (req, res) => {
  const { movieId } = req.params;
  try {
    // Sort by rating first (descending), then by likes (descending)
    const reviews = await Review.find({ movieId })
      .sort({ rating: -1, likes: -1 });

    if (reviews.length === 0) {
      return res.status(404).json({ msg: 'No reviews found for this movie' });
    }

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin: Delete any review
exports.adminDeleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    // Find and delete the review by its ID
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    // Update the movie's average rating after deleting the review
    await updateAverageRating(review.movieId);

    res.json({ msg: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Admin: Update any review
exports.adminUpdateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, reviewText } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;
    await review.save();

    await updateAverageRating(review.movieId);
    res.json({ msg: 'Review updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper function to update movie's average rating
const updateAverageRating = async (movieId) => {
  try {
    const reviews = await Review.find({ movieId });
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = (reviews.length > 0 ? totalRating / reviews.length : 0).toFixed(1);

    await Movie.findByIdAndUpdate(movieId, { averageRating });
  } catch (err) {
    console.error('Error updating average rating:', err);
  }
};
