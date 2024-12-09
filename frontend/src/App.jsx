import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(window.atob(token.split(".")[1]));
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserRole(decodedToken.role);
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []);

  const createRoutes = () =>
    createBrowserRouter([
      {
        path: "/",
        element: isAuthenticated ? (
          <Navigate to="/customer-dashboard" replace />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Register />,
      },
      {
        path: "/customer-dashboard",
        element: userRole === "customer" && isAuthenticated ? (
          <CustomerDashboard />
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
          <Profile />
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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
