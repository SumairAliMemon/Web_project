const express = require("express");
const { updateProfile, bookHostel ,getBookingHistory ,getBookingDetails,getUserDetails ,cancelBooking} = require("../Controller/Profile");
const router = express.Router();
const {verifyToken} =  require("../middleware/authMiddleware");

// Route to update profile details (contact info and preferences)
router.put("/profile", verifyToken,updateProfile);

router.post("/bookHostel",verifyToken ,bookHostel);


// Route to fetch booking history


// Route to cancel a booking (move to booking history)
router.put("/cancel-booking", verifyToken ,cancelBooking);

router.get("/", verifyToken ,getUserDetails);

router.get("/booking", verifyToken, getBookingDetails);

router.get("/booking-history", verifyToken,getBookingHistory);


getBookingDetails

module.exports = router;
