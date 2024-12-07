const express = require("express");
const { getHostels  , getFeaturedHostels} = require("../Controller/hostelController");

const router = express.Router();

// Route to fetch hostels with pagination, search, and filters
router.get("/search", getHostels);
router.get("/", getFeaturedHostels);

module.exports = router;
