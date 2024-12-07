const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User giving the review
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true }, // Hostel being reviewed
  rating: { type: Number, min: 1, max: 5, required: true }, // Rating on a 1-5 scale
  reviewText: { type: String, required: true }, // Feedback text
  status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" }, // Moderation status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);
 