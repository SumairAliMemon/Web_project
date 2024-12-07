const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true, unique: true },
    pricePerMonth: { type: Number, required: true },
    occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References to Users
    availability: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    roomNumber:{type: Number, required: true},
    roomType: { type: String, enum: ["single", "double", "triple", "quad"], required: true },
  });
  
  module.exports = mongoose.model("Room", RoomSchema);
  