const mongoose = require("mongoose");
const ComplaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User filing the complaint
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Manager receiving the complaint
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved", "dismissed"], default: "pending" },
    response: { type: String }, // Manager's response to the complaint
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Complaint", ComplaintSchema);
  