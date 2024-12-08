const express = require("express");
const { postComplaint, deleteComplaint, getUserComplaints } = require("../Controller/complaintController");

const router = express.Router();

// POST: File a complaint
router.post("/", postComplaint);

// DELETE: Delete a complaint
router.delete("/:complaintId", deleteComplaint);

// GET: Get all complaints filed by the user
router.get("/", getUserComplaints);

module.exports = router;
