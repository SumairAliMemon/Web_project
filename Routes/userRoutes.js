const express = require("express");
const { updateProfile, bookHostel ,getBookingHistory , cancelBooking} = require("../Controller/userController");
const router = express.Router();


// Route to update profile details (contact info and preferences)
router.put("/profile", updateProfile);

router.post("/bookHostel", bookHostel);


// Route to fetch booking history
router.get("/booking-history", getBookingHistory);

// Route to cancel a booking (move to booking history)
router.put("/cancel-booking",  cancelBooking);


module.exports = router;
