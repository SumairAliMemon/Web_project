const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Actor = require('../models/actor'); // Ensure you import the Actor model
const Review = require('../models/review');
const DiscussionBoard = require('../models/discussion');  // Add this line to import the DiscussionBoard model
const Comment = require('../models/comment');
// Utility function to check if ObjectId is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Admin - Add a new movie
exports.addMovie = async (req, res) => {
  const { cast, releaseDate } = req.body; // Extract releaseDate and cast from the request body

  // Validate actor IDs in the cast arraya
  if (cast && cast.length > 0) {
    const invalidActors = [];

    // Check each actor in the cast array
    for (let actor of cast) {
      // Check if the actorId is valid
      if (actor && !isValidObjectId(actor)) {
        invalidActors.push(actor);
        continue;
      }

      // Check if actor exists in the database
      const actorExists = await Actor.findById(actor);
      if (!actorExists) {
        invalidActors.push(actor);
      }
    }

    // If there are invalid actor IDs, return an error
    if (invalidActors.length > 0) {
      return res.status(400).json({ msg: `Invalid or non-existent actors: ${invalidActors.join(', ')}` });
    }
  }

  try {
    // Set the 'isReleased' status based on the release date
    const currentDate = new Date();
    const releaseDateObj = new Date(releaseDate);

    // Determine if the movie is released (i.e., release date has passed)
    const isMovieReleased = releaseDateObj <= currentDate;

    // Create a new movie object with the updated isReleased status
    const newMovie = new Movie({
      ...req.body,
      isReleased: isMovieReleased,  // Set isReleased to true if release date is in the past, false otherwise
    });

    // Save the movie to the database
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin - Update movie details
exports.updateMovie = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ msg: 'Invalid movie ID' });
  }

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMovie) return res.status(404).json({ msg: 'Movie not found' });
    res.json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin - Delete a movie
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ msg: 'Invalid movie ID' });
  }

  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) return res.status(404).json({ msg: 'Movie not found' });
    res.json({ msg: 'Movie deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all movies - available to all users
// Get all movies - available to all users with pagination
exports.getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query params
    const skip = (page - 1) * limit; // Calculate how many to skip based on the page number

    const movies = await Movie.find().populate('cast', 'name').skip(skip).limit(limit);
    
    // Get the total number of movies for pagination purposes
    const totalMovies = await Movie.countDocuments();

    res.json({
      movies,
      totalMovies,
      totalPages: Math.ceil(totalMovies / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Get movie details by ID - available to all users
exports.getMovieById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ msg: 'Invalid movie ID' });
  }

  try {
    const movie = await Movie.findById(id).populate('cast', 'name');
    if (!movie) return res.status(404).json({ msg: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


/// only for admins 
// Get most popular movies based on average rating and review count
// Get most popular movies based on average rating and review count with pagination
exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .sort({ averageRating: -1, numberOfReviews: -1 })
      .skip(skip)
      .limit(limit);

    const totalMovies = await Movie.countDocuments();

    res.json({
      movies,
      totalMovies,
      totalPages: Math.ceil(totalMovies / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching popular movies' });
  }
};


// Get trending genres based on review frequency
// Get trending genres based on review frequency with pagination
exports.getTrendingGenres = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Add pagination here
    const skip = (page - 1) * limit;

    const genres = await Movie.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $skip: skip }, // Skip based on the page
      { $limit: limit }, // Limit based on the specified limit
    ]);

    res.json(genres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching trending genres' });
  }
};
;

// Get user engagement patterns (top reviewers)
/* exports.getUserEngagementPatterns = async (req, res) => {
  try {
    const engagement = await Review.aggregate([
      { $group: { _id: "$userId", reviewCount: { $sum: 1 } } },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 }
    ]);
    res.json(engagement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching user engagement patterns' });
  }
};
 */

exports.getUserEngagementPatterns = async (req, res) => {
  try {
    // Pagination parameters, ensure these are numbers
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided

    // Aggregation for user engagement in reviews
    const reviewEngagement = Review.aggregate([
      { $group: { _id: "$userId", reviewCount: { $sum: 1 } } }
    ]);

    // Aggregation for user engagement in discussions
    const discussionEngagement = DiscussionBoard.aggregate([
      { $group: { _id: "$createdBy", discussionCount: { $sum: 1 } } }
    ]);

    // Aggregation for user engagement in comments
    const commentEngagement = Comment.aggregate([
      { $group: { _id: "$createdBy", commentCount: { $sum: 1 } } }
    ]);

    // Combine the results of each aggregation
    const [reviews, discussions, comments] = await Promise.all([
      reviewEngagement,
      discussionEngagement,
      commentEngagement
    ]);

    // Map each engagement type by user ID for easier combination
    const engagementMap = {};

    reviews.forEach(({ _id, reviewCount }) => {
      if (!engagementMap[_id]) engagementMap[_id] = { reviewCount: 0, discussionCount: 0, commentCount: 0 };
      engagementMap[_id].reviewCount = reviewCount;
    });

    discussions.forEach(({ _id, discussionCount }) => {
      if (!engagementMap[_id]) engagementMap[_id] = { reviewCount: 0, discussionCount: 0, commentCount: 0 };
      engagementMap[_id].discussionCount = discussionCount;
    });

    comments.forEach(({ _id, commentCount }) => {
      if (!engagementMap[_id]) engagementMap[_id] = { reviewCount: 0, discussionCount: 0, commentCount: 0 };
      engagementMap[_id].commentCount = commentCount;
    });

    // Calculate total engagement per user and sort by engagement
    const engagementData = Object.entries(engagementMap).map(([userId, counts]) => ({
      userId,
      totalEngagement: counts.reviewCount + counts.discussionCount + counts.commentCount,
      reviewCount: counts.reviewCount,
      discussionCount: counts.discussionCount,
      commentCount: counts.commentCount
    }));

    // Sort by total engagement and paginate the result
    const topEngagement = engagementData
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice((page - 1) * limit, page * limit);  // Paginate based on page and limit

    res.json(topEngagement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching user engagement patterns' });
  }
};
