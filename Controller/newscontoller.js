const NewsArticle = require('../models/news');  // Import the NewsArticle model

// Helper function to get pagination values
const getPagination = (page, pageSize) => {
  const limit = pageSize || 10;  // Default page size is 10 if not provided
  const skip = (page - 1) * limit;  // Skip results based on the current page
  return { limit, skip };
};

// Create a news article
exports.createNewsArticle = async (req, res) => {
  try {
    const { title, content, category, relatedMovies = [], relatedActors = [], imageUrl } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    // Create a new news article
    const newArticle = new NewsArticle({
      title,
      content,
      category,
      relatedMovies,
      relatedActors,
      imageUrl,
    });

    await newArticle.save(); // Save the new news article
    return res.status(201).json({ message: 'News article created successfully', newArticle });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating news article' });
  }
};

// Get all news articles with pagination
exports.getAllNewsArticles = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;  // Default to page 1 and page size of 10
    const { limit, skip } = getPagination(page, pageSize);

    const articles = await NewsArticle.find().skip(skip).limit(limit);

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: 'No news articles found' });
    }

    // Get total count of articles for pagination info
    const totalArticles = await NewsArticle.countDocuments();

    return res.status(200).json({
      articles,
      pagination: {
        totalArticles,
        totalPages: Math.ceil(totalArticles / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching news articles' });
  }
};

// Get news articles by category with pagination
exports.getNewsArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, pageSize = 10 } = req.query;  // Default to page 1 and page size of 10
    const { limit, skip } = getPagination(page, pageSize);

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const articles = await NewsArticle.find({ category }).skip(skip).limit(limit);

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: `No news articles found for category: ${category}` });
    }

    // Get total count of articles for pagination info
    const totalArticles = await NewsArticle.countDocuments({ category });

    return res.status(200).json({
      articles,
      pagination: {
        totalArticles,
        totalPages: Math.ceil(totalArticles / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching news articles by category' });
  }
};

// Get news articles for a movie with pagination
exports.getNewsArticlesForMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;  // Default to page 1 and page size of 10
    const { limit, skip } = getPagination(page, pageSize);

    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    const articles = await NewsArticle.find({ relatedMovies: movieId }).skip(skip).limit(limit);

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: 'No news articles found for this movie' });
    }

    // Get total count of articles for pagination info
    const totalArticles = await NewsArticle.countDocuments({ relatedMovies: movieId });

    return res.status(200).json({
      articles,
      pagination: {
        totalArticles,
        totalPages: Math.ceil(totalArticles / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching news articles for movie' });
  }
};

// Get news articles for an actor with pagination
exports.getNewsArticlesForActor = async (req, res) => {
  try {
    const { actorId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;  // Default to page 1 and page size of 10
    const { limit, skip } = getPagination(page, pageSize);

    if (!actorId) {
      return res.status(400).json({ message: 'Actor ID is required' });
    }

    const articles = await NewsArticle.find({ relatedActors: actorId }).skip(skip).limit(limit);

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: 'No news articles found for this actor' });
    }

    // Get total count of articles for pagination info
    const totalArticles = await NewsArticle.countDocuments({ relatedActors: actorId });

    return res.status(200).json({
      articles,
      pagination: {
        totalArticles,
        totalPages: Math.ceil(totalArticles / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching news articles for actor' });
  }
};
