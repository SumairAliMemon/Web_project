const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  categories: [String],
  roomIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }], // References to Room Collection
  amenities: [String],
  images: [{ type: String }], // Array to store multiple image paths
  rating: Number, // Average rating calculated from reviews
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  isApproved: { type: Boolean, default: false }, // Approval status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hostel", HostelSchema);
