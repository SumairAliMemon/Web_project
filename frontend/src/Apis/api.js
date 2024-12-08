import axios from 'axios';

// Base URL for the backend
const BASE_URL = 'http://localhost:5500/api';

// Set up axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token Handling (for Authorization)
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Store user data for global access
let userData = {};
export const setUserData = (data) => {
  userData = data;
};
export const getUserData = () => userData;

// API Calls

// Hostels

export const fetchFeaturedHostels = () => apiClient.get('/hostels');

// User
export const updateUserProfile = (profileData) => apiClient.put('/User/profile', profileData);
export const bookHostel = (bookingData) => apiClient.post('/User/bookHostel', bookingData);
export const fetchBookingHistory = () => apiClient.get('/User/booking-history');
export const cancelBooking = (cancelData) => apiClient.put('/User/cancel-booking', cancelData);

// Cancel Booking Manager
export const cancelBookingManager = (data) => apiClient.post('/cancelBooking', data);

// Announcements
export const fetchAnnouncements = () => apiClient.get('/announcements');

// Complaints
export const postComplaint = (complaintData) => apiClient.post('/complaints/complaint', complaintData);
export const deleteComplaint = (complaintId) => apiClient.delete(`/complaints/complaint/${complaintId}`);
export const fetchUserComplaints = () => apiClient.get('/complaints/complaints');

// Reviews
export const postReview = (reviewData) => apiClient.post('/review', reviewData);
export const deleteReview = (reviewId) => apiClient.delete(`/review/${reviewId}`);

// Utility Functions
export const initializeUserStore = (token) => {
  setAuthToken(token);

  // Decode token to extract user ID and fetch user data
  const userId = decodeTokenToUserId(token); // Implement this function based on your JWT structure
  return fetchUserData(userId).then((data) => {
    const { hostelDetails } = data;
    setUserData({
      userId,
      hostelId: hostelDetails?.hostelId,
      roomId: hostelDetails?.roomId,
    });
  });
};

const fetchUserData = (userId) => {
  // Mock implementation; replace with an actual endpoint to fetch user data
  return Promise.resolve({
    hostelDetails: {
      hostelId: 'mockHostelId',
      roomId: 'mockRoomId',
    },
  });
};
