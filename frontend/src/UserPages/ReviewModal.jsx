import axios from "axios";
import React, { useState } from "react";
import './ReviewModal.css'; // Import CSS for the modal

const ReviewModal = ({ hostelId, closeModal, refreshBookings }) => {
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5500/api/review", {
        rating,
        reviewText,
      });
      alert(response.data.message);
      refreshBookings(); // Refresh bookings to show new review
      closeModal(); // Close the modal
    } catch (error) {
      alert("Error posting review: " + error.response.data.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Review:</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit Review</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal; 