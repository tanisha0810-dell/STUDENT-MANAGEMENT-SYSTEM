import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ role }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">Student Management System</Link>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/students" className="nav-item">Students</Link>
          <Link to="/announcements" className="nav-item">Announcements</Link>
          <Link to="/courses" className="nav-item">Courses</Link>
          <Link to="/teachers" className="nav-item">Teachers</Link>
        </div>
      </div>
    </nav>
  );
}
