import React from 'react';
import { Navigate } from 'react-router-dom';

// Define the ProtectedRoute component to handle authentication and role-based access
const ProtectedRoute = ({ children, isAuthenticated, allowedRoles, userRole }) => {
  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user doesn't have the correct role, redirect to 404 page or another fallback page
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/404" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
