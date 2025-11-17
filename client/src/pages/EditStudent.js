import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    course: "",
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Correct API routes
        const [courseRes, studentRes] = await Promise.all([
          api.get("/courses"),
          api.get(`/students/${id}`),
        ]);

        if (courseRes.data.success) {
          setCourses(courseRes.data.courses);
        }

        const s = studentRes.data.student;
        if (!s) {
          setMsg("Student not found");
          return;
        }

        setForm({
          name: s.name,
          email: s.email,
          rollNumber: s.rollNumber,
          course: s.course?._id || "",
        });
      } catch (err) {
        console.error("Edit load error:", err);
        setMsg("Error loading data");
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Saving...");

    try {
      const res = await api.put(`/students/${id}`, form);

      if (res.data.success) {
        setMsg("Updated successfully!");
        setTimeout(() => navigate("/students"), 800);
      } else {
        setMsg("Failed to update");
      }
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Edit Student</h2>
        {msg && <p style={msgStyle}>{msg}</p>}

        <form onSubmit={handleSubmit} style={formBox}>
          
          <label style={label}>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={input}
            required
          />

          <label style={label}>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            style={input}
            required
          />

          <label style={label}>Roll Number</label>
          <input
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            style={input}
            required
          />

          <label style={label}>Course</label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            style={input}
            required
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>

          <button style={btn}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}


// -------------- Styles ----------------

const page = {
  display: "flex",
  justifyContent: "center",
  paddingTop: 40,
};

const card = {
  width: "450px",
  background: "#ffffff",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
};

const title = {
  textAlign: "center",
  marginBottom: "15px",
  color: "#333",
};

const msgStyle = {
  textAlign: "center",
  color: "green",
  fontWeight: "bold",
};

const formBox = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const label = {
  fontWeight: "bold",
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #bbb",
};

const btn = {
  padding: "12px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
  fontWeight: "bold",
};
