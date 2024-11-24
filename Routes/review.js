const express = require('express');
const router = express.Router();
const { adminDeleteReview,  adminUpdateReview ,addReview, updateReview, getMovieReviews } = require('../Controller/ratingcontroller');
const {authMiddleware , adminAuth} = require('../middleware/middleware');


router.post('/', authMiddleware, addReview);

router.put('/', authMiddleware, updateReview);

// Get all reviews for a movie
router.get('/:movieId',authMiddleware, getMovieReviews);

// for admin only  
router.delete('/admin/:reviewId', authMiddleware, adminAuth, adminDeleteReview);
router.put('/admin/:reviewId', authMiddleware,adminAuth ,adminUpdateReview);

module.exports = router;
