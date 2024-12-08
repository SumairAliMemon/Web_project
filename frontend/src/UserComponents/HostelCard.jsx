import { Coffee, MapPin, Star, Waves, Wifi } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HostelCard.css';

const HostelCard = ({ hostel }) => {
  const navigate = useNavigate();

  if (!hostel) return null;

  // Helper function for amenity icons
  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'free wi-fi':
        return <Wifi size={16} />;
      case 'breakfast included':
        return <Coffee size={16} />;
      case 'swimming pool':
        return <Waves size={16} />;
      default:
        return null;
    }
  };

  // Since roomIds is now an array of strings, we'll need to handle that differently
  const handleViewDetails = () => {
    navigate(`/hostel/${hostel._id}`);
  };

  return (
    <div className="hostel-card">
      {/* Rating Badge */}
      <div className="card-rating">
        <Star className="star-icon" />
        <span>{hostel.rating?.toFixed(1) || 'N/A'}</span>
      </div>
      
      {/* Image Section */}
      <div className="card-image-container">
        <img 
          src={hostel.images?.[0] 
            ? `http://localhost:5000/uploads/${hostel.images[0]}`
            : '/placeholder-hostel.jpg'
          }
          alt={hostel.name}
          className="card-image"
          onError={(e) => {
            e.target.src = '/placeholder-hostel.jpg';
          }}
        />
      </div>

      {/* Content Section */}
      <div className="card-content">
        <h3 className="hostel-name">{hostel.name}</h3>
        
        <div className="location-info">
          <MapPin size={16} className="location-icon" />
          <span>{hostel.location}</span>
        </div>

        {/* Description */}
        <p className="hostel-description">
          {hostel.description?.length > 100 
            ? `${hostel.description.substring(0, 100)}...` 
            : hostel.description}
        </p>

        {/* Amenities */}
        <div className="amenities-list">
          {hostel.amenities?.slice(0, 3).map((amenity, index) => (
            <div key={index} className="amenity-item">
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="categories">
          {hostel.categories?.map((category, index) => (
            <span key={index} className="category-tag">
              {category}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="card-footer">
          <div className="price-info">
            <span className="price-label">Details</span>
            <span className="rooms-available">
              {`${hostel.roomIds?.length || 0} Rooms Available`}
            </span>
          </div>
          <button 
            className="details-button"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;