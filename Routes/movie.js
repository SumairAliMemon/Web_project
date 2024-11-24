// Routes/movie.js
const express = require('express');
const router = express.Router();
const movies = require('../Controller/moviecontroller');
const {authMiddleware , adminAuth  }= require('../middleware/middleware');
const {paginationMiddleware} = require('../middleware/pagenation');

// Movie Routes
router.post('/', authMiddleware, adminAuth, movies.addMovie);
router.put('/:id', authMiddleware, adminAuth, movies.updateMovie);
router.delete('/:id', adminAuth, movies.deleteMovie);
router.get('/',authMiddleware,adminAuth, paginationMiddleware,movies.getAllMovies);
router.get('/:id',authMiddleware,adminAuth, movies.getMovieById);

// Site statistics
router.get('/stats/popular-movies',  authMiddleware, adminAuth, paginationMiddleware,movies.getPopularMovies);
router.get('/stats/trending-genres',  authMiddleware, adminAuth,paginationMiddleware,movies.getTrendingGenres);
router.get('/stats/user-engagement',  authMiddleware, adminAuth,paginationMiddleware, movies.getUserEngagementPatterns);

module.exports = router;
