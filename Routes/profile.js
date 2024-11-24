const express = require('express');
const router = express.Router();
const profileController = require('../Controller/profilecontroller');
const {authMiddleware} = require('../middleware/middleware');

// Get user profile
router.get('/', authMiddleware, profileController.getProfile);

// Update user profile
router.put('/update', authMiddleware, profileController.updateProfile);

// Add movie to wishlist
router.post('/wishlist', authMiddleware, profileController.addToWishlist);

// Remove movie from wishlist
router.delete('/wishlist', authMiddleware, profileController.removeFromWishlist);

router.get('/wishlist', authMiddleware, profileController.getWishlist);

module.exports = router;
