const express = require("express");
const { postComplaint, deleteComplaint, getUserComplaints } = require("../Controller/complaintController");
const {verifyToken} = require("../middleware/authMiddleware");
const router = express.Router();

// POST: File a complaint
router.post("/",verifyToken, postComplaint);

// DELETE: Delete a complaint
router.delete("/:complaintId",verifyToken, deleteComplaint);

// GET: Get all complaints filed by the user
router.get("/", verifyToken,getUserComplaints);

module.exports = router;
