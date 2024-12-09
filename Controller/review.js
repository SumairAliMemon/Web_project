const mongoose = require("mongoose");
const Review = require("../models/review");
const Hostel = require("../models/Hostel");
const User = require("../models/Users");

// Post a review
const postReview = async (req, res) => {
  try {
    const userId = '675481e1cbde32e998bcc830'; // Assuming `req.user` contains the authenticated user's ID
    const { rating, reviewText } = req.body;

    // Validate rating range (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating should be between 1 and 5." });
    }

    // Find user to get the hostelId
    const user = await User.findById(userId).select("hostelDetails.hostelId");
    if (!user || !user.hostelDetails || !user.hostelDetails.hostelId) {
      return res.status(404).json({ message: "User is not enrolled in any hostel." });
    }

    const hostelId = user.hostelDetails.hostelId;

    // Check if the hostel exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found." });
    }

    // Create new review
    const review = new Review({
      userId,
      hostelId,
      rating,
      reviewText,
    });

    // Save review
    await review.save();

    // Add review to the hostel's reviews
    hostel.reviews.push(review._id);

    // Update hostel rating
    await updateHostelRating(hostelId);

    // Save hostel
    await hostel.save();

    return res.status(201).json({ message: "Review posted successfully", review });
  } catch (error) {
    console.error("Error posting review:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.user;  

    // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if the review belongs to the user
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own reviews." });
    }

    // Remove review from the hostel's reviews
    const hostel = await Hostel.findById(review.hostelId);
    hostel.reviews = hostel.reviews.filter((id) => id.toString() !== reviewId);

    // Update hostel rating after review deletion
    await updateHostelRating(hostel._id);

    // Save hostel changes
    await hostel.save();

    // Delete the review
    await review.remove();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Hostel's average rating
const updateHostelRating = async (hostelId) => {
  try {
    const hostel = await Hostel.findById(hostelId).populate("reviews");

    if (!hostel || hostel.reviews.length === 0) {
      hostel.rating = 0;  // If no reviews, set rating to 0
      await hostel.save();
      return;
    }

    // Calculate total rating from the reviews
    const totalRating = hostel.reviews.reduce((acc, review) => acc + review.rating, 0);
    const avgRating = totalRating / hostel.reviews.length;

    // Update the hostel's rating
    hostel.rating = avgRating.toFixed(1);  // Round to 1 decimal place
    await hostel.save();
  } catch (error) {
    console.error("Error updating hostel rating:", error);
  }
};

module.exports = {
  postReview,
  deleteReview,
};
