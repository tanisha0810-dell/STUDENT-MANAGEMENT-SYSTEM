import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    courseId: ""
  });

  const [msg, setMsg] = useState("");

  // Load teacher + courses
  useEffect(() => {
    loadTeacher();
    loadCourses();
  }, [id]);

  const loadTeacher = async () => {
    try {
      const res = await api.get("/teachers/" + id);
      if (res.data.success) {
        const t = res.data.teacher;
        setForm({
          name: t.name,
          email: t.email,
          subject: t.subject,
          courseId: t.courseId?._id || ""
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-sync: update selected course when subject matches
    if (name === "subject") {
      const match = courses.find(
        (c) =>
          c.subject?.toLowerCase() === value.toLowerCase() ||
          c.name?.toLowerCase() === value.toLowerCase()
      );

      setForm({
        ...form,
        subject: value,
        courseId: match ? match._id : ""
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Saving...");

    try {
      const res = await api.put("/teachers/" + id, form);

      if (res.data.success) {
        setMsg("Updated successfully!");
        setTimeout(() => navigate("/teachers"), 900);
      }
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2>Edit Teacher</h2>
        {msg && <p style={{ color: "green" }}>{msg}</p>}

        <form onSubmit={handleSubmit} style={formBox}>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={input}
            required
          />

          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            style={input}
            required
          />

          <label>Subject</label>
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            style={input}
            required
          />

          <label>Assign Course (auto-updates if subject matches)</label>
          <select
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            style={input}
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.subject})
              </option>
            ))}
          </select>

          <button style={btn}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}

const page = { display: "flex", justifyContent: "center", paddingTop: 40 };
const card = {
  width: 420,
  padding: 25,
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 3px 10px rgba(0,0,0,0.2)"
};
const formBox = { display: "flex", flexDirection: "column", gap: 12 };
const input = { padding: 10, borderRadius: 6, border: "1px solid #bbb" };
const btn = {
  padding: 12,
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};
