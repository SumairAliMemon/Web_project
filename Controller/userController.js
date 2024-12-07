const User = require("../models/Users");
const Hostel = require("../models/Hostel");  // Assuming Hostel schema is in models/Hostel.js
const Room = require("../models/room");
const BookingHistory = require("../models/bookinghistory");

// Update Profile (edit contact info and preferences)
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;  // Assuming you're using JWT to authenticate and the user ID is passed in req.user
    const { phone, address } = req.body;  // Only allow editing phone and address for now

    // Find the user by ID and update contact info
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { "contactInfo.phone": phone, "contactInfo.address": address, updatedAt: Date.now() },
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Booking History (view hostel and room details)
const bookHostel = async (req, res) => {
    try {
      const { userId } = req.user;  // User ID from authenticated token
      const { hostelId, roomId, rentDueDate } = req.body;  // hostelId, roomId, and rentDueDate for booking
  
      // Fetch the user to check if they are already enrolled in a hostel
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user is already enrolled in a hostel
      if (user.hotelDetails?.hostelId) {
        return res.status(400).json({
          message: "You are already enrolled in a hostel. You cannot book another hostel.",
        });
      }
  
      // Find the room and hostel to ensure they exist and are available for booking
      const hostel = await Hostel.findById(hostelId);
      const room = await Room.findById(roomId);
  
      if (!hostel || !room) {
        return res.status(404).json({ message: "Hostel or Room not found" });
      }
  
      // Check if the room is already booked (Assume each room can only be booked by one user at a time)
      const isRoomBooked = await User.findOne({ "hotelDetails.roomId": roomId });
      if (isRoomBooked) {
        return res.status(400).json({ message: "Room is already booked" });
      }
  
      // Update the user's hotelDetails with the hostelId, roomId, and rentDueDate
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            "hotelDetails.hostelId": hostelId,
            "hotelDetails.roomId": roomId,
            "hotelDetails.rentDueDate": rentDueDate,
            "hotelDetails.monthlyrentpaid": false, // Default rent status is unpaid
            updatedAt: Date.now(),
          },
        },
        { new: true } // Return the updated document
      );
  
      return res.status(200).json({ message: "Booking successful", user: updatedUser });
    } catch (error) {
      console.error("Error booking hostel:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  


  const getBookingHistory = async (req, res) => {
    try {
      const { userId } = req.user;  // User ID from authenticated token
  
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
  
  // Cancel/Delete Booking (move to booking history and remove from user)
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
  

module.exports = {
  updateProfile,
  bookHostel,
  cancelBooking,
  getBookingHistory

};
