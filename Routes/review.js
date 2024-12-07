const express = require("express");
const router = express.Router();
const { postReview, deleteReview } = require("../Controller/review");

// Route for posting a review
router.post("/", postReview);

// Route for deleting a review
router.delete("/:reviewId", deleteReview);

module.exports = router;
