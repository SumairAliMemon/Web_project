import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../UserComponents/NavBar";
import './Complain.css'; // Import the CSS file for styling

const Complain = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserComplaints();
  }, []);

  const fetchUserComplaints = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/complaints"); // Adjust the endpoint as necessary
      if (response.data.complaints) {
        setComplaints(response.data.complaints);
      }
    } catch (err) {
      setError("Failed to fetch complaints.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5500/api/complaints", {
        subject,
        description,
      });
      setComplaints([...complaints, response.data.complaint]); // Add the new complaint to the list
      setSubject('');
      setDescription('');
    } catch (err) {
      setError("Failed to post complaint.");
    }
  };

  const handleDelete = async (complaintId) => {
    try {
      await axios.delete(`http://localhost:5500/api/complaints/${complaintId}`);
      setComplaints(complaints.filter(complaint => complaint._id !== complaintId)); // Remove the deleted complaint from the list
    } catch (err) {
      setError("Failed to delete complaint.");
    }
  };

  return (
<>    <NavBar />
    <div className="complain-page">
     
      <h1>File a Complaint</h1>
      <form onSubmit={handleSubmit} className="complaint-form">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Submit Complaint</button>
      </form>

      {loading && <p>Loading complaints...</p>}
      {error && <p className="error-message">{error}</p>}
      {complaints.length === 0 && !loading && <p>No complaints filed.</p>}

      <div className="complaints-list">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="complaint-card">
            <h2>{complaint.subject}</h2>
            <p>{complaint.description}</p>
            <p className="complaint-status">Status: <strong>{complaint.status}</strong></p>
            <p className="complaint-meta">
              <span>Filed on: {new Date(complaint.createdAt).toLocaleDateString()}</span>
              <button onClick={() => handleDelete(complaint._id)}>Delete</button>
            </p>
          </div>
        ))}
      </div>
    </div>
    </>

  );
};

export default Complain;
