import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const hostelAPI = {
  // Get random hostels with pagination
  getRandomHostels: async (page = 1, limit = 8) => {
    try {
      const response = await axios.get(`${BASE_URL}/hostels/random`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search and filter hostels
  searchHostels: async (searchParams, page = 1, limit = 8) => {
    try {
      const response = await axios.post(`${BASE_URL}/hostels/search`, 
        searchParams,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get hostel details
  getHostelDetails: async (hostelId) => {
    try {
      const response = await axios.get(`${BASE_URL}/hostels/${hostelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Book a hostel
  bookHostel: async (bookingData) => {
    try {
      const response = await axios.post(`${BASE_URL}/hostels/book`, bookingData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};