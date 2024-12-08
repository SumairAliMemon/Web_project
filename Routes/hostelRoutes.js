const express = require("express");
const {
  getHostelById,
  getFeaturedHostels,
  searchFilterHostels,
  getRandomHostels,
} = require("../Controller/hostelController");

const router = express.Router();

// Define specific routes first to avoid conflict with dynamic ":id" route
router.get("/featured", getRandomHostels); // Endpoint to fetch random hostels
router.post("/search", searchFilterHostels); // Endpoint to search and filter hostels
router.get("/", getFeaturedHostels); // Endpoint to fetch featured hostels with pagination
router.get("/id/:id", getHostelById); // Endpoint to fetch a single hostel by ID

module.exports = router;
