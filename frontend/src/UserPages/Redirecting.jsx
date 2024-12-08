import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
  useEffect(() => {
    
      // If no token, redirect to login page
      return <Navigate to="/login" />;
    
  }, []);

  //return <div>Redirecting...</div>; // Show something temporarily, or just keep it empty
};

export default HomeRedirect;
