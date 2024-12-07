// controllers/hostelController.js
const Hostel = require('../models/Hostel');

// Get Hostels with Pagination, Search, and Filters
const getHostels = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, location, price, rating, amenities } = req.query;

    // Build query object
    const query = {};

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: Number(rating) }; // Minimum rating
    }

    // Filter by amenities
    if (amenities) {
      query.amenities = { $all: amenities.split(',') }; // All specified amenities must be present
    }

    // Execute query with pagination
    const hostels = await Hostel.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    // Count total documents for pagination
    const totalHostels = await Hostel.countDocuments(query);

    res.status(200).json({
      hostels,
      totalPages: Math.ceil(totalHostels / limit),
      currentPage: Number(page),
      totalHostels
    });
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getFeaturedHostels = async (req, res) => {
  try {
    // Get the top 5 most reviewed hostels
    const mostReviewed = await Hostel.aggregate([
      {
        $project: {
          name: 1,
          reviewsCount: { $size: "$reviews" }, // Count the number of reviews
        },
      },
      { $sort: { reviewsCount: -1 } }, // Sort by the number of reviews in descending order
      { $limit: 5 }, // Limit to top 5 hostels
    ]);

    // Get the top 5 most searched hostels
    const mostSearched = await Hostel.find({}).sort({ searchCount: -1 }).limit(5); // Sort by search count

    res.status(200).json({
      mostReviewed,
      mostSearched,
    });
  } catch (error) {
    console.error("Error fetching featured hostels:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getHostels , getFeaturedHostels };
