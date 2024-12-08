const express = require("express");
//const { updateProfile, bookHostel ,getBookingHistory , cancelBooking} = require("../Controller/userController");
const router = express.Router();
const {cancelBookingManager} =  require("../Controller/cancelbookingmail.js")




// Route to cancel a booking (move to booking history)
router.post("/",  cancelBookingManager);


module.exports = router;
