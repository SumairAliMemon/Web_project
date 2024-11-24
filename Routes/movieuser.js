const express = require('express');
const { getMovieDetails, getUserHomepage , searchMovies } = require('../Controller/moiveusercontroller');
const {authMiddleware} = require('../middleware/middleware');
const {paginationMiddleware} = require('../middleware/pagenation');
const router = express.Router();

router.get('/movies/:movieId', authMiddleware ,paginationMiddleware,getMovieDetails);
router.get('/', authMiddleware, paginationMiddleware ,getUserHomepage);
router.post('/search', authMiddleware,paginationMiddleware,searchMovies);

module.exports = router;
