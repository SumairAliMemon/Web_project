import axios from "axios";
import React, { useState } from "react";
import './EditModal.css'; // Import the CSS file for styling

const EditModal = ({ user, closeModal, fetchUserDetails }) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.contactInfo.phone);
  const [address, setAddress] = useState(user.contactInfo.address);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5500/api/User/profile", {
        name,
        contactInfo: { phone, address },
      });
      fetchUserDetails(); // Refresh user details after update
      closeModal(); // Close the modal
    } catch (err) {
      setError("Failed to update user details.");
      console.error("Failed to update user details:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="update-button">Update</button>
          <button type="button" className="close-button" onClick={closeModal}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditModal; 