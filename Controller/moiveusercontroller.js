const { getSimilarTitles, getTrendingMovies, getTopRatedMovies, getPersonalizedRecommendations } = require('../utills/recommendation');
const Movie = require('../models/Movie');

// Movie Page: Similar Titles
exports.getMovieDetails = async (req, res) => {
  let { movieId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Added page and limit for pagination

  // Trim movieId to remove any extra whitespace or newline characters
  movieId = movieId.trim();

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    // Get Similar Titles (assuming it returns an array)
    const allSimilarTitles = await getSimilarTitles(movieId);

    // Manually paginate the similar titles using slice
    const similarTitles = allSimilarTitles.slice((page - 1) * limit, page * limit);

    res.json({
      movie,
      similarTitles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// User Homepage: Personalized Recommendations
exports.getUserHomepage = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query; // Added page and limit for pagination

  try {
    // Fetch personalized recommendations
    const recommendations = await getPersonalizedRecommendations(userId);

    // Fetch trending movies (without pagination first)
    const allTrendingMovies = await getTrendingMovies();

    // Paginate trending movies manually
    const trendingMovies = allTrendingMovies.slice((page - 1) * limit, page * limit);

    // Fetch top-rated movies (without pagination first)
    const allTopRatedMovies = await getTopRatedMovies();

    // Paginate top-rated movies manually
    const topRatedMovies = allTopRatedMovies.slice((page - 1) * limit, page * limit);

    res.json({
      recommendations,
      trendingMovies,
      topRatedMovies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Search movies by multiple optional filters
exports.searchMovies = async (req, res) => {
  try {
    const { query, rating, genre } = req.body;
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters

    const skip = (page - 1) * limit; // Calculate the skip value for pagination

    // Initialize the filter object to apply search conditions
    let filter = { isReleased: true }; // Only show released movies

    // Apply filter for movie title (case-insensitive)
    if (query && query.trim() !== '') {
      filter.title = { $regex: query.trim(), $options: 'i' }; // case-insensitive match
    }

    // Apply filter for rating (greater than or equal to the provided rating)
    if (rating && !isNaN(rating)) {
      filter.averageRating = { $gte: rating }; // Filter movies with rating >= provided rating
    }

    // Apply filter for genre (if provided as a string or an array of genres)
    if (genre && genre.trim() !== '') {
      const genreArray = genre.trim().split(',').map(g => g.trim());
      filter.genre = { $in: genreArray }; // Matches movies with any of the specified genres
    }

    // Find movies based on the filter and apply pagination
    let movies = await Movie.find(filter)
      .skip(skip) // Skip based on pagination
      .limit(parseInt(limit)); // Limit the number of movies

    // Remove duplicates based on title (if the same movie appears in multiple filters)
    const movieTitlesSet = new Set();
    const uniqueMovies = [];

    // Go through the list of movies and add only unique ones based on their title
    for (let movie of movies) {
      if (!movieTitlesSet.has(movie.title)) {
        uniqueMovies.push(movie);
        movieTitlesSet.add(movie.title); // Add the title to the set to ensure uniqueness
      }
    }

    // If no movies match the filter
    if (uniqueMovies.length === 0) {
      return res.status(404).json({ message: "No released movies found matching the criteria" });
    }

    // Fetch total count for pagination information
    const totalCount = await Movie.countDocuments(filter);

    return res.json({
      movies: uniqueMovies,
      totalCount,
      pagination: {
        page: parseInt(page), // Current page based on query parameter
        limit: parseInt(limit), // Limit per page
        totalPages: Math.ceil(totalCount / parseInt(limit)), // Total number of pages
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

