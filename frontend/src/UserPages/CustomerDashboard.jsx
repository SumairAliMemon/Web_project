import axios from 'axios';
import { Filter, MapPin, Search } from 'lucide-react';
import React, { useEffect, useState } from "react";
import HostelCard from "../UserComponents/HostelCard";
import NavBar from "../UserComponents/NavBar";
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    amenities: [],
    rating: ''
  });

  useEffect(() => {
    loadRandomHostels();
  }, []);

  const loadRandomHostels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5500/api/hostels/featured`, {
        params: { limit: 8 }
      });

      if (response.data.success) {
        setHostels(response.data.hostels);
        setFilteredHostels(response.data.hostels);
      }
    } catch (error) {
      setError("Failed to load hostels");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (hostelsToFilter) => {
    let filtered = hostelsToFilter;

    if (filters.priceRange.min) {
      filtered = filtered.filter(hostel => hostel.pricePerMonth >= filters.priceRange.min);
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(hostel => hostel.pricePerMonth <= filters.priceRange.max);
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(hostel => 
        filters.amenities.every(amenity => hostel.amenities.includes(amenity))
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(hostel => hostel.rating >= filters.rating);
    }

    return filtered;
  };

  const searchHostels = async () => {
    try {
      setLoading(true);
      const requestData = { searchTerm };

      if (filters.priceRange.min || filters.priceRange.max || filters.amenities.length > 0 || filters.rating) {
        requestData.filters = filters;
      }

      const response = await axios.post(`http://localhost:5500/api/hostels/search`, requestData, {
        params: { limit: 8 }
      });

      if (response.data.success) {
        const searchedHostels = response.data.hostels;
        setHostels(searchedHostels);
        setFilteredHostels(applyFilters(searchedHostels));
        if (searchedHostels.length === 0) {
          setError("No hostels found.");
        }
      }
    } catch (error) {
      setError("Failed to search hostels");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchHostels();
    } else {
      loadRandomHostels();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim()) {
      const filtered = hostels.filter(hostel =>
        hostel.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredHostels(applyFilters(filtered));
    } else {
      loadRandomHostels();
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      const newFilters = {
        ...prevFilters,
        [filterType]: value
      };
      // Update filtered hostels whenever a filter is changed
      setFilteredHostels(applyFilters(hostels));
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      priceRange: { min: '', max: '' },
      amenities: [],
      rating: ''
    });
    loadRandomHostels();
  };

  const handleNearMe = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Use a reverse geocoding API to get the city name
        try {
          const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client`, {
            params: {
              latitude,
              longitude,
              localityLanguage: 'en'
            }
          });

          const cityName = response.data.city || response.data.locality || '';
          setSearchTerm(cityName); // Set the city name in the search input
          await searchHostels(); // Trigger the search automatically
        } catch (error) {
          console.error("Error fetching city name:", error);
          setError("Failed to get your location.");
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        setError("Unable to retrieve your location.");
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="dashboard-container">
        <form onSubmit={handleSearch} className="search-section">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search hostels..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <button 
            type="button"
            className="near-me-button"
            onClick={handleNearMe}
            title="Find Hostels Near Me"
          >
            <MapPin size={24} />
          </button>

          <button 
            type="button"
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter />
            Filters
          </button>

          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {showFilters && (
          <div className="filters-panel">
            <div className="price-filter">
              <label>Price Range (r/month)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                />
              </div>
            </div>

            <div className="amenities-filter">
              <label>Amenities</label>
              <div className="amenities-options">
                {['Free Wi-Fi', 'Breakfast Included', 'Swimming Pool'].map(amenity => (
                  <label key={amenity} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={(e) => {
                        const newAmenities = e.target.checked 
                          ? [...filters.amenities, amenity] 
                          : filters.amenities.filter(a => a !== amenity);
                        handleFilterChange('amenities', newAmenities);
                      }}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className="rating-filter">
              <label>Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">Any</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            <button type="button" className="clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {loading && <div className="loading-container">Loading...</div>}

        {error && <div className="error-container">{error}</div>}

        <div className="hostels-grid">
          {!loading && !error && filteredHostels.map(hostel => (
            <HostelCard key={hostel._id} hostel={hostel} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;