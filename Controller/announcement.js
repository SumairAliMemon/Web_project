const mongoose = require("mongoose");
const Announcement = require("../models/announcement");
const User = require("../models/Users");
const Hostel = require("../models/Hostel");

const getUserAnnouncements = async (req, res) => {
  try {
   // const {userId} = req.user?.userId || req.qurey.user 
    // Assuming the user is authenticated and their userId is available
const userId= '675481e1cbde32e998bcc830';
    // Ensure the userId is valid (check if the user exists in the system)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user has hostel details
    const userHostelDetails = user.hostelDetails;
    console.log(userHostelDetails);
    if (!userHostelDetails.hostelId) {
     
      return res.status(400).json({ message: "User does not belong to any hostel." });
    }

    // Fetch the hostel using the hostelId from the user
    const hostel = await Hostel.findById(userHostelDetails.hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found." });
    }

    // Fetch announcements where the user is either in the 'specific_customers' list
    // or the 'targetAudience' is 'all_customers', and the manager of the hostel is the creator
    const announcements = await Announcement.find({
      $or: [
        { targetAudience: "all_customers" },  // All customers can see this
        { targetAudience: "specific_customers", customerIds: { $in: [userId] } }  // User is in the list of specific customers
      ],
      managerId: hostel.ownerId  // The announcement's manager must be the hostel's owner
    }).populate("managerId", "name email")  // Optional: populate manager details
      .sort({ createdAt: -1 });  // Sort by creation date (newest first)

    if (announcements.length === 0) {
      return res.status(404).json({ message: "No announcements found for the user." });
    }

    return res.status(200).json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserAnnouncements,
};
