const express = require("express");
const router = express.Router();
const { postReview, deleteReview } = require("../Controller/review");
const {verifyToken} =  require("../middleware/authMiddleware");

// Route for posting a review
router.post("/",verifyToken ,postReview);

// Route for deleting a review
router.delete("/:reviewId", verifyToken,deleteReview);

module.exports = router;
