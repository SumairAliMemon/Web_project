import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../UserComponents/NavBar";
import './Announcements.css'; // Import the CSS file for styling

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5500/api/announcements"); // Adjust the endpoint as necessary
        if (response.data.announcements) {
          setAnnouncements(response.data.announcements);
        }
      } catch (err) {
        setError("Failed to fetch announcements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <>
      <NavBar />
    
    <div className="announcements-page">
    
      <h1>Announcements</h1>
      {loading && <p>Loading announcements...</p>}
      {error && <p className="error-message">{error}</p>}
      {announcements.length === 0 && !loading && <p>No announcements available.</p>}
      <div className="announcements-list">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="announcement-card">
            <h2>{announcement.title}</h2>
            <p>{announcement.content}</p>
            <p className="announcement-meta">
              <span>By: {announcement.managerId.name}</span>
              <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Announcements;
