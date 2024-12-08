import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../UserComponents/NavBar";
import EditModal from "./EditModal"; // Import the modal component
import './Profile.css'; // Import the CSS file for styling

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState({ phone: '', address: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/User");
      setUser(response.data.user);
    } catch (err) {
      setError("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p className="loading-message">Loading user details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (

    <>
     <NavBar />

    <div className="profile-page">
     
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="profile-card">
          <h2>User Details</h2>
          <div className="detail-item">
            <strong>Name:</strong> <span>{user.name}</span>
          </div>
          <div className="detail-item">
            <strong>Phone:</strong> <span>{user.contactInfo.phone}</span>
          </div>
          <div className="detail-item">
            <strong>Address:</strong> <span>{user.contactInfo.address}</span>
          </div>
          <div className="detail-item">
            <strong>Hostel:</strong> <span>{user.hostelDetails.hostelId.name}</span>
          </div>
          <div className="detail-item">
            <strong>Location:</strong> <span>{user.hostelDetails.hostelId.location}</span>
          </div>
          <div className="detail-item">
            <strong>Room:</strong> <span>{user.hostelDetails.roomId ? `${user.hostelDetails.roomId.roomNumber} (${user.hostelDetails.roomId.roomType})` : "Not assigned"}</span>
          </div>
          <div className="detail-item">
            <strong>Status:</strong> <span>{user.status}</span>
          </div>
          <div className="detail-item">
            <strong>Joined:</strong> <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <button className="edit-button" onClick={handleEditClick}>✏️ Edit</button>
        </div>
      </div>
      {isModalOpen && <EditModal user={user} closeModal={closeModal} fetchUserDetails={fetchUserDetails} />}
    </div>
    </>
  );
};

export default Profile;
