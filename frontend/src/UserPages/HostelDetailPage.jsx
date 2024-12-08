import axios from 'axios'; // Make sure axios is installed
import { ArrowLeft, ArrowRight, CheckCircle, Coffee, MapPin, Star, Waves, Wifi } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './HostelDetailPage.css';

const HostelDetailPage = () => {
  const navigate = useNavigate();
  const { id} = useParams();
  const [hostel, setHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchHostelDetails();
  }, [id]);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      setBookingError('');
      // Update this URL to match your backend API endpoint
      console.log(id + "eheeerererer\n");
      const response = await axios.get(`http://localhost:5500/api/hostels/id/${id}`);
      setHostel(response.data);
    } catch (error) {
      console.error('Error fetching hostel details:', error);
      setBookingError('Failed to load hostel details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedRoom) {
      setBookingError('Please select a room first');
      return;
    }

    try {
      const bookingData = {
        hostelId: hostel._id,
        roomId: selectedRoom._id,
        rentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      // Update this URL to match your backend API endpoint
      const response = await axios.post('http://localhost:5500/api/User/bookHostel', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          // Add your authentication token here if required
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.message === "Booking successful") {
        navigate('/dashboard', { 
          state: { message: 'Booking successful!' }
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError(error.response?.data?.message || 'Failed to book hostel. Please try again.');
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'free wi-fi':
        return <Wifi size={18} />;
      case 'breakfast included':
        return <Coffee size={18} />;
      case 'swimming pool':
        return <Waves size={18} />;
      default:
        return <CheckCircle size={18} />;
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (hostel.images?.length - 1) ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (hostel.images?.length - 1) : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading hostel details...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="error-container">
        <p>Hostel not found</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="hostel-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Back to Search
        </button>
      </div>

      <div className="detail-content">
        <div className="image-gallery-container">
          <div className="image-gallery">
            {hostel.images?.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5500/uploads/${image}`}
                alt={`${hostel.name} - ${index + 1}`}
                className={`gallery-image ${index === currentImageIndex ? 'active' : ''}`}
                onError={(e) => {
                  e.target.src = '/placeholder-hostel.jpg';
                }}
              />
            ))}
          </div>
          
          {hostel.images?.length > 1 && (
            <>
              <div className="gallery-nav">
                <button className="gallery-button" onClick={prevImage}>
                  <ArrowLeft size={20} />
                </button>
                <button className="gallery-button" onClick={nextImage}>
                  <ArrowRight size={20} />
                </button>
              </div>
              
              <div className="gallery-dots">
                {hostel.images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="hostel-header">
          <h1>{hostel.name}</h1>
          <div className="meta-info">
            <div className="location">
              <MapPin size={18} />
              <span>{hostel.location}</span>
            </div>
            <div className="rating">
              <Star size={18} />
              <span>{hostel.rating}</span>
            </div>
          </div>
        </div>

        <p className="description">{hostel.description}</p>

        <div className="categories-section">
          <h2>Categories</h2>
          <div className="categories-list">
            {hostel.categories?.map((category, index) => (
              <span key={index} className="category-tag">
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="amenities-section">
          <h2>Amenities</h2>
          <div className="amenities-list">
            {hostel.amenities?.map((amenity, index) => (
              <span key={index} className="amenity-tag">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="rooms-section">
          <h2>Available Rooms</h2>
          <div className="rooms-grid">
            {hostel.rooms?.map((room) => (
              <div 
                key={room._id}
                className={`room-card ${selectedRoom?._id === room._id ? 'selected' : ''}`}
                onClick={() => room.availability ? setSelectedRoom(room) : null}
              >
                <div className="room-header">
                  <h3>Room {room.roomNumber}</h3>
                  <span className={`availability ${room.availability ? 'available' : ''}`}>
                    {room.availability ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <div className="room-details">
                  <span>Type: {room.roomType}</span>
                  <span className="price">₹{room.pricePerMonth}/month</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {bookingError && (
          <div className="error-message">
            {bookingError}
          </div>
        )}

        <button 
          className="book-now-button"
          onClick={handleBooking}
          disabled={!selectedRoom}
        >
          {selectedRoom ? `Book Room ${selectedRoom.roomNumber} Now` : 'Select a Room to Book'}
        </button>
      </div>
    </div>
  );
};

export default HostelDetailPage; 