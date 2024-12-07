const FeedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    rating: { type: Number, min: 1, max: 5, required: true },
    reviewText: String,
    status: { type: String, enum: ["approved", "pending", "denied"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Feedback", FeedbackSchema);
  