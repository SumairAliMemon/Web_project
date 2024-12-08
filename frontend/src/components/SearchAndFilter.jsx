import { Grid3X3, MapPin, Search, Star } from 'lucide-react';
import React from 'react';
import './SearchAndFilter.css';

const SearchAndFilter = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          name="search"
          placeholder="Search hostels..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="filters-group">
        <div className="filter-item">
          <MapPin className="filter-icon" />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
          />
        </div>

        <div className="filter-item">
          <Star className="filter-icon" />
          <select
            name="rating"
            value={filters.rating}
            onChange={handleChange}
          >
            <option value="">Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>

        <div className="filter-item">
          <Grid3X3 className="filter-icon" />
          <select
            name="amenities"
            value={filters.amenities}
            onChange={handleChange}
          >
            <option value="">Amenities</option>
            <option value="wifi">WiFi</option>
            <option value="ac">AC</option>
            <option value="food">Food</option>
            <option value="laundry">Laundry</option>
          </select>
        </div>

        <button className="search-button" onClick={onSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter; 