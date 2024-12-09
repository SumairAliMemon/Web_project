import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios"; // import axios for API requests
import React, { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Announcements from "./UserPages/Announcements";
import Bookings from "./UserPages/Booking";
import Complain from "./UserPages/Complain";
import CustomerDashboard from "./UserPages/CustomerDashboard";
import HostelDetailPage from "./UserPages/HostelDetailPage";
import Profile from "./UserPages/Profile";
import Login from "./UserPages/login";
import Register from "./UserPages/register";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(window.atob(token.split(".")[1]));
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserRole(decodedToken.role);
          axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (token, user) => {
    setIsAuthenticated(true);
    setUserRole(user.role); // Set user role after successful login
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
    axios.defaults.headers['Authorization'] = "";
  };

  const createRoutes = () => createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? (userRole === "customer" ? <Navigate to="/customer-dashboard" /> : <Navigate to="/announcements" />) : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: isAuthenticated ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />,
    },
      {
        path: "/signup",
        element: <Register />,
      },
      {
        path: "/customer-dashboard",
        element: userRole === "customer" && isAuthenticated ? (
          <CustomerDashboard onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: "/announcements",
        element: ["customer", "admin"].includes(userRole) && isAuthenticated ? (
          <Announcements />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: "/complain",
        element: userRole === "customer" && isAuthenticated ? (
          <Complain />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: "/profile",
        element: ["customer", "admin"].includes(userRole) && isAuthenticated ? (
          <Profile onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: "/bookings",
        element: userRole === "customer" && isAuthenticated ? (
          <Bookings />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: "/hello",
        element: userRole === "manager" && isAuthenticated ? (
          <div>Welcome to Manager</div>
        ) : (
          <Navigate to="/login" replace />
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
        path: "*",
        element: <div>404 - Page Not Found</div>,
      },
    ]);

  const router = createRoutes();

  if (isLoading) {
    // Add a loading spinner or placeholder while verifying the token
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
