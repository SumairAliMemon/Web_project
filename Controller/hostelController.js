const Hostel = require("../models/Hostel");

// Get Hostel by ID
const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id).populate({
      path: "roomIds",
      select: "pricePerMonth roomType roomNumber availability",
      populate: {
        path: "occupants",
        select: "name email",
      },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    res.status(200).json({
      id: hostel._id,
      name: hostel.name,
      location: hostel.location,
      description: hostel.description,
      amenities: hostel.amenities,
      rating: hostel.rating,
      rooms: hostel.roomIds,
      images: hostel.images,
      totalRooms: hostel.roomIds.length,
      isApproved: hostel.isApproved,
      createdAt: hostel.createdAt,
      updatedAt: hostel.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching hostel:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Featured Hostels
const getFeaturedHostels = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;

    const hostels = await Hostel.find({})
      .sort({ searchCount: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "roomIds",
        select: "pricePerMonth roomType roomNumber availability",
        populate: {
          path: "occupants",
          select: "name email",
        },
      });

    const total = await Hostel.countDocuments();

    res.status(200).json({
      hostels: hostels.map((hostel) => ({
        id: hostel._id,
        name: hostel.name,
        location: hostel.location,
        description: hostel.description,
        amenities: hostel.amenities,
        rating: hostel.rating,
        rooms: hostel.roomIds,
        totalRooms: hostel.roomIds.length,
        isApproved: hostel.isApproved,
        createdAt: hostel.createdAt,
        updatedAt: hostel.updatedAt,
      })),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching featured hostels:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Random Hostels
const getRandomHostels = async (req, res) => {
  const { limit = 8 } = req.query;

  try {
    const hostels = await Hostel.aggregate([
      { $sample: { size: parseInt(limit, 10) } },
    ]);

    const total = await Hostel.countDocuments();

    res.status(200).json({
      success: true,
      hostels,
      totalHostels: total,
    });
  } catch (error) {
    console.error("Error fetching random hostels:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching random hostels",
      error: error.message,
    });
  }
};


const searchFilterHostels = async (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const { searchTerm, priceRange, amenities, rating } = req.body;

  try {
    const skip = (page - 1) * limit;

    // Build query object
    const query = {};

    // Search Term Handling for Partial Match on `name` and `location`
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } }, // Case-insensitive partial match on `name`
        { location: { $regex: searchTerm, $options: "i" } }, // Case-insensitive partial match on `location`
      ];
    }

    // Price Range Filtering
    if (priceRange?.min != null && priceRange?.max != null) {
      query["roomIds.pricePerMonth"] = {
        $gte: priceRange.min,
        $lte: priceRange.max,
      };
    }

    // Amenities Filtering
    if (Array.isArray(amenities) && amenities.length > 0) {
      query.amenities = { $all: amenities };
    }

    // Rating Filtering
    if (rating != null) {
      query.rating = { $gte: rating };
    }

    // Fetch matching hostels with pagination
    const hostels = await Hostel.find(query)
      .populate({
        path: "roomIds",
        select: "pricePerMonth roomType roomNumber availability",
      })
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: -1 });

    // Count total documents matching the query
    const total = await Hostel.countDocuments(query);

    // Return response
    res.status(200).json({
      success: true,
      hostels,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalHostels: total,
    });
  } catch (error) {
    console.error("Error searching hostels:", error);
    res.status(500).json({
      success: false,
      message: "Error searching hostels",
      error: error.message,
    });
  }
};



module.exports = {
  getHostelById,
  getFeaturedHostels,
  getRandomHostels,
  searchFilterHostels,
};
