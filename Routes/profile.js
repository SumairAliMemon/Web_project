const express = require("express");
const { updateProfile, bookHostel ,getBookingHistory ,getBookingDetails,getUserDetails ,cancelBooking} = require("../Controller/Profile");
const router = express.Router();


// Route to update profile details (contact info and preferences)
router.put("/profile", updateProfile);

router.post("/bookHostel", bookHostel);


// Route to fetch booking history


// Route to cancel a booking (move to booking history)
router.put("/cancel-booking",  cancelBooking);

router.get("/",  getUserDetails);

router.get("/booking",  getBookingDetails);

router.get("/booking-history", getBookingHistory);


getBookingDetails

module.exports = router;
