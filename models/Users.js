const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["super_admin", "hostel_owner", "customer"], required: true }, // Single role
  contactInfo: {
    phone: String,
    address: String,
  },
  hostelDetails: {
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    monthlyRentPaid: { type: Boolean, default: false },
    rentDueDate: Date,
  },
  status: { type: String, enum: ["active", "blacklisted"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to ensure activeRole is valid
UserSchema.pre("save", function (next) {
  if (this.activeRole && !this.roles.includes(this.activeRole)) {
    return next(new Error("activeRole must be one of the user's assigned roles"));
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
