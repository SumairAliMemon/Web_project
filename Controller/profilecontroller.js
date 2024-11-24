const User = require('../models/User');
const mongoose = require('mongoose');
// Remove movie from wishlist
const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { favoriteGenres, favoriteActors } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (favoriteGenres) user.moviePreferences.favoriteGenres = favoriteGenres;
    if (favoriteActors) user.moviePreferences.favoriteActors = favoriteActors;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Add movie to wishlist


exports.addToWishlist = async (req, res) => {
    const { movieId } = req.body;

    try {
        
              const userId = req.user.id;
              const user = await User.findById(userId);
        console.log("Retrieved User:", user);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.wishlist.includes(movieId)) {
            return res.status(400).json({ msg: 'Movie already in wishlist' });
        }

        user.wishlist.push(movieId);
        await user.save();
        res.json({ msg: 'Movie added to wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};




exports.removeFromWishlist = async (req, res) => {
  const { movieId } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
  
    const movieIdString = movieId.toString();
    
    // Check if the movie exists in wishlist before removal
    const initialLength = user.wishlist.length;
    
    // Remove the movieId from the wishlist
    user.wishlist = user.wishlist.filter(id => 
      id.toString() !== movieIdString
    );
    
    

    // Save only if there was actually a change
    if (initialLength !== user.wishlist.length) {
      await user.save();
      return res.json({ msg: 'Movie removed from wishlist' });
    } else {
      return res.status(400).json({ msg: 'Movie not found in wishlist' });
    }

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Get user wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
