import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../UserComponents/NavBar";
import './Booking.css'; // Import the CSS file
import ReviewModal from "./ReviewModal"; // Import the ReviewModal component

const Bookings = () => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState(null);

  useEffect(() => {
    fetchCurrentBooking();
    fetchBookingHistory();
  }, []);

  const fetchCurrentBooking = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/User/booking");
      setCurrentBooking(response.data.bookingDetails);
    } catch (err) {
      setError("Failed to fetch current booking.");
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/User/booking-history");
      setBookingHistory(response.data.bookingHistory.hostelIds);
    } catch (err) {
      setError("Failed to fetch booking history.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = (hostelId) => {
    setSelectedHostelId(hostelId);
    setIsModalOpen(true); // Open the review modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHostelId(null);
  };

  const refreshBookings = () => {
    fetchCurrentBooking();
    fetchBookingHistory();
  };

  if (loading) return <p className="loading-message">Loading bookings...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <NavBar />
      <div className="booking-container">
        <h2>Current Booking</h2>
        {currentBooking ? (
          <div className="booking-details">
            <h3>{currentBooking.hostelId.name}</h3>
            <p>Location: {currentBooking.hostelId.location}</p>
            <p>Description: {currentBooking.hostelId.description}</p>
            <p>Amenities: {currentBooking.hostelId.amenities.join(", ")}</p>
            <div className="button-container">
              <button className="payment-button">Payment</button>
              <button className="add-review-button" onClick={() => handleAddReview(currentBooking.hostelId._id)}>
                Review
              </button>
            </div>
          </div>
        ) : (
          <p>No current bookings found.</p>
        )}

        <h2>Booking History</h2>
        {bookingHistory.length > 0 ? (
          bookingHistory.map((hostel) => (
            <div key={hostel._id} className="booking-details">
              <h3>{hostel.name}</h3>
              <p>Location: {hostel.location}</p>
              <p>Description: {hostel.description}</p>
              <p>Amenities: {hostel.amenities.join(", ")}</p>
              {/* No buttons for booking history */}
            </div>
          ))
        ) : (
          <p>No booking history found.</p>
        )}
      </div>
      {isModalOpen && (
        <ReviewModal
          hostelId={selectedHostelId}
          closeModal={closeModal}
          refreshBookings={refreshBookings}
        />
      )}
    </>
  );
};

export default Bookings;