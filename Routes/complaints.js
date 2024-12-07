const express = require("express");
const { postComplaint, deleteComplaint, getUserComplaints } = require("../Controller/complaintController");

const router = express.Router();

// POST: File a complaint
router.post("/complaint", postComplaint);

// DELETE: Delete a complaint
router.delete("/complaint/:complaintId", deleteComplaint);

// GET: Get all complaints filed by the user
router.get("/complaints", getUserComplaints);

module.exports = router;
