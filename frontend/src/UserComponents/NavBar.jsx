import React from "react";
import { FaBullhorn, FaClipboardList, FaExclamationCircle, FaHome, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./navbar.css"; // Import the custom CSS

const NavBar = () => {
  return (
    <nav className="navbar">
      {/* Navbar Container */}
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="logo">
          <h1>Hostel Hub</h1>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {[
            { name: "Home", path: "/customer-dashboard", icon: <FaHome /> },
            { name: "Announcements", path: "/announcements", icon: <FaBullhorn /> },
            { name: "Complain", path: "/complain", icon: <FaExclamationCircle /> },
            { name: "Profile", path: "/profile", icon: <FaUser /> },
            { name: "Bookings", path: "/bookings", icon: <FaClipboardList /> },
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div className="logout">
          <button onClick={() => alert("Logged Out")}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
