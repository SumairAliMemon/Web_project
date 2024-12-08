import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"; // Import the NavBar
import Announcements from "./UserPages/Announcements";
import Bookings from "./UserPages/Booking";
import Complain from "./UserPages/Complain";
import CustomerDashboard from "./UserPages/CustomerDashboard";
import HostelDetailPage from "./UserPages/HostelDetailPage";
import Profile from "./UserPages/Profile";

const queryClient = new QueryClient()
const App = () => {
  // Hardcode the user role as 'customer'
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Sample authentication state (should be true for testing)
  const [userRole , setuserRole] =useState ( "customer"); // Hardcoded role for testing

  const createRoutes = () => {
    return createBrowserRouter([
      {
        path: "/",
        element: <Navigate to="/customer-dashboard" replace />, // Default redirect to Customer Dashboard
      },
      {
        path: "/login",
        element: <div>Login Page</div>,
      },
      {
        path: "/signup",
        element: <div>Signup Page</div>,
      },
      {
        path: "/customer-dashboard",
        element: userRole === "customer" && isAuthenticated ? (
          <>

<QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <CustomerDashboard />
    </QueryClientProvider>
       
       
          </>
        ) : (
          <Navigate to="/login" replace /> // Redirect to login if not authenticated or wrong role
        ),
      },
      {
        path: "/announcements",
        element: (userRole === "customer" || userRole === "admin") && isAuthenticated ? (
          <>

            <Announcements />
          </>
        ) : (
          <Navigate to="/login" replace /> // Redirect to login if not authenticated or wrong role
        ),
      },
      {
        path: "/complain",
        element: userRole === "customer" && isAuthenticated ? (
          <>

            <Complain />
          </>
        ) : (
          <Navigate to="/login" replace /> // Redirect to login if not authenticated or wrong role
        ),
      },
      {
        path: "/profile",
        element: (userRole === "customer" || userRole === "admin") && isAuthenticated ? (
          <>
        
            <Profile />
          </>
        ) : (
          <Navigate to="/login" replace /> // Redirect to login if not authenticated or wrong role
        ),
      },
      {
        path: "/bookings",
        element: userRole === "customer" && isAuthenticated ? (
          <>
    
            <Bookings />
          </>
        ) : (
          <Navigate to="/login" replace /> // Redirect to login if not authenticated or wrong role
        ),
      },

      {
        path: "/hello",
        element: userRole === "manager" && isAuthenticated ? (
          <>
    
            <> Welcome to Manager</>
          </>
        ) : (
          <Navigate to="/login" replace /> // Redirect to login if not authenticated or wrong role
        ),
      },
      {
        path: "/hostel/:id",
        element: userRole === "customer" && isAuthenticated ? (
          <HostelDetailPage />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: "*", // Catch-all for undefined paths
        element: <div>404 - Page Not Found</div>,
      },
      
    ]);
  };

  const router = createRoutes();
  return <RouterProvider router={router} />;
};

export default App;
