import { Link } from "react-router-dom";

export default function Navbar({ role }) {

  return (
    <nav style={{
      background: "#222",
      padding: "12px",
      display: "flex",
      gap: "20px",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white" }}>Home</Link>

      {(role === "admin" || role === "teacher") && (
        <Link to="/students" style={{ color: "white" }}>Students</Link>
      )}

      <Link to="/announcements" style={{ color: "white" }}>
        Announcements
      </Link>

      {/* FIXED: added color:white */}
      <Link to="/add-course" style={{ color: "white" }}>
        Add Course
      </Link>

    </nav>
  );
}

