
const Complaint = require("../models/complaints");
const User = require("../models/Users");

// Post a complaint
const postComplaint = async (req, res) => {
  try {
    const { userId } = req.user;  // Assuming the user is authenticated
    const { managerId, subject, description } = req.body;

    // Check if the manager exists
    const manager = await User.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }

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
    const { userId } = req.user;  // Assuming the user is authenticated

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
    await complaint.remove();

    return res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Complaints by the user
const getUserComplaints = async (req, res) => {
  try {
    const { userId } = req.user;  // Assuming the user is authenticated

    // Find complaints filed by the user
    const complaints = await Complaint.find({ userId }).populate("managerId", "name email");

    if (complaints.length === 0) {
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
