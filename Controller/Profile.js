const User = require("../models/Users");
const Hostel = require("../models/Hostel");  // Assuming Hostel schema is in models/Hostel.js
const Room = require("../models/room");
const BookingHistory = require("../models/bookinghistory");

// Update Profile (edit contact info and preferences)
const getUserDetails = async (req, res) => {
  try {
    const userId = '675481e1cbde32e998bcc830'; // Assuming user is authenticated and userId is available

    // Find the user and populate hostel and room details
    const user = await User.findById(userId)
      .select("-passwordHash -email") // Exclude sensitive fields
      .populate("hostelDetails.hostelId", "name location") // Include hostel name and location
      .populate("hostelDetails.roomId", "roomNumber roomType"); // Include room number and type

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update user details (excluding password, email, and hostel-related fields)
const updateProfile = async (req, res) => {
  try {
    const userId = '675481e1cbde32e998bcc830';  // Assuming user is authenticated and userId is available in req.user
    const { name, contactInfo } = req.body;  // Only allow updates to name and contactInfo

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user details, excluding password, email, and hostel-related fields
    user.name = name || user.name;

    // Ensure contactInfo is an object and update its properties
    if (contactInfo) {
      user.contactInfo = {
        ...user.contactInfo, // Preserve existing contactInfo
        ...contactInfo // Update with new values
      };
    }

    // Save updated user details
    await user.save();

    return res.status(200).json({ message: "User details updated successfully", user });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get Booking History (view hostel and room details)
const bookHostel = async (req, res) => {
  try {
    const userId = '675481e1cbde32e998bcc830'; // Assume authenticated user ID is available in req.user
    const { hostelId, roomId, rentDueDate } = req.body; // hostelId, roomId, and rentDueDate for booking

    // Fetch the user to check if they are already enrolled in a hostel
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already enrolled in a hostel
    if (user.hostelDetails?.hostelId) {
      return res.status(400).json({
        message: "You are already enrolled in a hostel. You cannot book another hostel.",
      });
    }

    // Find the hostel and room to ensure they exist
    const hostel = await Hostel.findById(hostelId);
    const room = await Room.findById(roomId);

    if (!hostel || !room) {
      return res.status(404).json({ message: "Hostel or Room not found" });
    }

    // Check if the room is already booked
    const isRoomBooked = await User.findOne({ "hostelDetails.roomId": roomId });
    if (isRoomBooked) {
      return res.status(400).json({ message: "Room is already booked" });
    }

    // Update user's hotelDetails
    user.hostelDetails = {
      hostelId,
      roomId,
      rentDueDate,
      monthlyRentPaid: false, // Default rent status is unpaid
    };
    user.updatedAt = Date.now();
    await user.save();

    return res.status(200).json({ message: "Booking successful", user });
  } catch (error) {
    console.error("Error booking hostel:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const { userId } = req.user;  // User ID from authenticated token
    const { hostelId, roomId } = req.body;  // Hostel ID and Room ID to cancel

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the booking exists in the user's details
    const bookingExists = user.hotelDetails.hostelId?.toString() === hostelId && user.hotelDetails.roomId?.toString() === roomId;
    if (!bookingExists) {
      return res.status(404).json({ message: "No such booking found" });
    }

    // Create a new booking history entry
    const bookingHistoryEntry = new BookingHistory({
      userId,
      hostelIds: [hostelId],
      bookingDates: [Date.now()],  // Store the booking date when booking is canceled
    });

    // Save to booking history
    await bookingHistoryEntry.save();

    // Clear the booking details from the user's record
    user.hotelDetails = {};  // Remove all booking-related data
    await user.save();

    return res.status(200).json({ message: "Booking canceled successfully and saved to booking history" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


  const getBookingHistory = async (req, res) => {
    try {
      const  userId  = '675481e1cbde32e998bcc830';  // User ID from authenticated token
  
      // Find user and populate booking history details
      const bookingHistory = await BookingHistory.findOne({ userId })
        .populate("hostelIds")  // Populate hostel details from hostelIds
        .exec();
  
      if (!bookingHistory || bookingHistory.hostelIds.length === 0) {
        return res.status(404).json({ message: "No booking history found" });
      }
  
      return res.status(200).json({ bookingHistory });
    } catch (error) {
      console.error("Error fetching booking history:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  
  
  const getBookingDetails = async (req, res) => {
    try {
      const userId = '675481e1cbde32e998bcc830' ; // Extract userId from the route parameter
  
      // Find the user and populate the hostel and room details
      const user = await User.findById(userId)
        .select("hostelDetails")
        .populate({
          path: "hostelDetails.hostelId",
          select: "name location amenities",
        })
        .populate({
          path: "hostelDetails.roomId",
          select: "roomNumber roomType pricePerMonth availability",
        });
  
      if (!user || !user.hostelDetails) {
        return res.status(404).json({ message: "User or booking details not found." });
      }
  
      res.status(200).json({ 
        success: true,
        bookingDetails: user.hostelDetails 
      });
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching booking details",
        error: error.message,
      });
    }
  };
  
  



module.exports = {
  updateProfile,
  bookHostel,
  cancelBooking,
  getBookingHistory,
  getUserDetails,
  getBookingDetails

};
