const Complaint = require("../models/complaints");
const User = require("../models/Users");
const Hostel = require("../models/Hostel");  // Correct import for Hostel model

// Post a complaint
const postComplaint = async (req, res) => {
  try {
    const userId = '675481e1cbde32e998bcc830'; // Assuming the user is authenticated
    const { subject, description } = req.body;

    // Find the user's hostelId from their hostelDetails
    const user = await User.findById(userId);
    if (!user || !user.hostelDetails || !user.hostelDetails.hostelId) {
      return res.status(404).json({ message: "User is not enrolled in any hostel." });
    }

    // Fetch the hostel using the user's hostelId
    const hostel = await Hostel.findById(user.hostelDetails.hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found." });
    }

    // Get the managerId from the hostel details (assuming ownerId is the manager)
    const managerId = hostel.ownerId; // Assuming the ownerId in hostel is the managerId

    // Create a new complaint
    const complaint = new Complaint({
      userId,
      managerId,
      subject,
      description,
    });

    // Save the complaint
    await complaint.save();

    return res.status(201).json({ message: "Complaint posted successfully", complaint });
  } catch (error) {
    console.error("Error posting complaint:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a complaint
const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;  // Complaint ID to delete
    const userId = '675481e1cbde32e998bcc830' ;  // Assuming the user is authenticated

    // Find the complaint by ID
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Check if the complaint belongs to the authenticated user
    if (complaint.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own complaints." });
    }

    // Delete the complaint
    await Complaint.deleteOne({ _id: complaintId });

    return res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Complaints by the user
const getUserComplaints = async (req, res) => {
  try {
    const userId = '675481e1cbde32e998bcc830';  // Assuming the user is authenticated

    // Find complaints filed by the user using the correct query
    const complaints = await Complaint.find({ userId });
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for the user." });
    }

    return res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  postComplaint,
  deleteComplaint,
  getUserComplaints,
};
