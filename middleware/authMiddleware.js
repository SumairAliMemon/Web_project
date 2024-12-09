const User = require("../models/Users");
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user ID to request
    req.userRole = decoded.role; // Attach user role to request
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}; 
module.exports = { verifyToken };
