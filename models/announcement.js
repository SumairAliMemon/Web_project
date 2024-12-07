const mongoose = require("mongoose");
const AnnouncementSchema = new mongoose.Schema({
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Manager creating the announcement
    title: { type: String, required: true },
    content: { type: String, required: true },
    targetAudience: { type: String, enum: ["all_customers", "specific_customers"], default: "all_customers" },
    customerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // If targetAudience is "specific_customers"
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Announcement", AnnouncementSchema);
  