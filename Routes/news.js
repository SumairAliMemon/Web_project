const express = require('express');
const router = express.Router();
const {
  createNewsArticle,
  getAllNewsArticles,
  getNewsArticlesByCategory,
  getNewsArticlesForMovie,
  getNewsArticlesForActor
} = require('../Controller/newscontoller.js'); 

// Create a news article
router.post('/', createNewsArticle);

// Get all news articles
router.get('/', getAllNewsArticles);

// Get news articles by category (Movies, Actors, Industry)
router.get('/category/:category', getNewsArticlesByCategory);

// Get news articles related to a specific movie
router.get('/movie/:movieId', getNewsArticlesForMovie);

// Get news articles related to a specific actor
router.get('/actor/:actorId', getNewsArticlesForActor);

module.exports = router;
