const mongoose = require('mongoose');

// Define the Booking History Schema
const bookingHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User schema
        required: true,
    },
    hostelIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hostel', // References the Hostel schema
        }
    ],
    bookingDates: [
        {
            type: Date,
            default: Date.now, // Date of booking
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the booking history was created
    },
});

// Export the Booking History model
const BookingHistory = mongoose.model('BookingHistory', bookingHistorySchema);

module.exports = BookingHistory;
