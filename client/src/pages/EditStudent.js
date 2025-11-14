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
    course: ""
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Load courses + student data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseRes, studentRes] = await Promise.all([
          api.get("/courses"),
          api.get("/students/" + id),
        ]);

        if (courseRes.data.success) {
          setCourses(courseRes.data.courses);
        }

        if (studentRes.data.success) {
          const s = studentRes.data.student;
          setForm({
            name: s.name,
            email: s.email,
            rollNumber: s.rollNumber,
            course: s.course?._id || "",
          });
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadData();
  }, [id]);


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Saving...");

    try {
      const res = await api.put("/students/" + id, form);

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


  if (loading) return <p>Loading student...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Student</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

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
              {c.name}
            </option>
          ))}
        </select>

        <button style={btn}>Save Changes</button>
      </form>
    </div>
  );
}


const formBox = {
  width: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  background: "#fafafa",
  padding: 20,
  borderRadius: 6,
  border: "1px solid #ddd"
};

const label = { fontWeight: "bold" };

const input = {
  padding: "8px",
  borderRadius: 4,
  border: "1px solid #aaa"
};

const btn = {
  padding: "10px",
  background: "blue",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};
