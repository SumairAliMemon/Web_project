const User = require('../models/Users.js');
const BookingHistory = require('../models/bookinghistory.js');
const sendEmail = require('../services/emailservice.js');  // Import the email service

// Cancel Booking API
const cancelBookingManager = async (req, res) => {
  try {
    const { userId } = req.user;  // User ID from authenticated token
    const { hostelId, roomId } = req.body;  // Hostel ID and Room ID to cancel

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the booking exists in the user's details
    const bookingExists = user.hostelDetails.hostelId?.toString() === hostelId && user.hostelDetails.roomId?.toString() === roomId;
    if (!bookingExists) {
      return res.status(404).json({ message: "No such booking found" });
    }

    // Create a new booking history entry
    const bookingHistoryEntry = new BookingHistory({
      userId,
      hostelIds: [hostelId],
      bookingDates: [Date.now()],
    });

    // Save to booking history
    await bookingHistoryEntry.save();

    // Send cancellation email
    const subject = 'Your Hostel Booking Has Been Canceled';
    const text = `Dear ${user.name},\n\nYour booking at the hostel with ID: ${hostelId} and room ID: ${roomId} has been canceled by Manager .\n\nBest regards, Hostel Management`;
    await sendEmail(user.email, subject, text);  // Send email to user

    // Clear the booking details from the user's record
    user.hostelDetails = {};  // Remove all booking-related data
    await user.save();

    return res.status(200).json({ message: "Booking canceled successfully and saved to booking history" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { cancelBookingManager };
