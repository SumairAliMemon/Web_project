const Movie = require('../models/Movie');
const Review = require('../models/review');
const User = require('../models/User');

// Fetch Similar Titles based on Genre or Director
async function getSimilarTitles(movieId) {
  const movie = await Movie.findById(movieId);
  if (!movie) return [];

  const similarMovies = await Movie.find({
    _id: { $ne: movieId },
    isReleased: true, // Only consider released movies
    $or: [
      { genre: { $in: movie.genre } },  // Similar genres
      { director: movie.director },      // Same director
    ],
  }).limit(5);

  return similarMovies;
}


// Fetch Trending Movies based on the number of reviews
async function getTrendingMovies() {
  const trendingMovies = await Movie.aggregate([
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'movieId', as: 'reviews' } },
    { $project: { title: 1, genre: 1, reviewsCount: { $size: '$reviews' } } },
    { $sort: { reviewsCount: -1 } },  // Sort by number of reviews (trending)
    { $limit: 5 }                    // Limit to top 5 trending
  ]);

  return trendingMovies;
}

// Fetch Top Rated Movies based on average ratings
async function getTrendingMovies() {
  const trendingMovies = await Movie.aggregate([
    { $match: { isReleased: true } },  // Only consider released movies
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'movieId', as: 'reviews' } },
    { $project: { title: 1, genre: 1, reviewsCount: { $size: '$reviews' } } },
    { $sort: { reviewsCount: -1 } },  // Sort by number of reviews (trending)
    { $limit: 5 }                    // Limit to top 5 trending
  ]);

  return trendingMovies;
}

// Personalized Recommendations based on User Preferences
async function getTopRatedMovies() {
  const topRatedMovies = await Movie.aggregate([
    { $match: { isReleased: true } },  // Only consider released movies
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'movieId', as: 'reviews' } },
    { $addFields: { averageRating: { $avg: '$reviews.rating' } } },  // Calculate average rating
    { $sort: { averageRating: -1 } },  // Sort by average rating
    { $limit: 5 }                    // Limit to top 5 rated movies
  ]);

  return topRatedMovies;
}
async function getPersonalizedRecommendations(userId) {
  const user = await User.findById(userId);
  if (!user) return [];

  // Find movies based on user's favorite genres (only released movies)
  const genreRecommendations = await Movie.find({
    isReleased: true,  // Only consider released movies
    genre: { $in: user.moviePreferences.favoriteGenres }
  }).limit(5);

  // Find movies rated highly by users with similar preferences (only released movies)
  const similarUserRecommendations = await Review.aggregate([
    { $match: { userId: { $ne: userId }, rating: { $gte: 4 } } }, // Find reviews with rating >= 4
    { $lookup: { from: 'movies', localField: 'movieId', foreignField: '_id', as: 'movie' } },
    { $unwind: '$movie' },
    { $match: { 'movie.genre': { $in: user.moviePreferences.favoriteGenres }, 'movie.isReleased': true } }, // Only consider released movies
    { $group: { _id: '$movieId', movie: { $first: '$movie' } } },
    { $limit: 5 }
  ]);

  return {
    genreRecommendations,
    similarUserRecommendations
  };
}


module.exports = {
  getSimilarTitles,
  getTrendingMovies,
  getTopRatedMovies,
  getPersonalizedRecommendations
};
