import { useEffect, useState } from "react";
import api from "../services/api";
import { sendWSMessage, socket } from "../webSocketClient";

export default function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    course: ""
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // FETCH COURSES INITIALLY
  useEffect(() => {
    api.get("/courses")
      .then(res => {
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      })
      .catch(err => console.error("Course fetch error:", err));
  }, []);

  // LISTEN FOR NEW_COURSE FROM WEBSOCKET
  useEffect(() => {
    if (!socket) return;

    const handler = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "NEW_COURSE") {
          setCourses(prev => [...prev, data.payload]);
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    socket.addEventListener("message", handler);

    return () => {
      socket.removeEventListener("message", handler);
    };
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/students", form);
      console.log("Student added:", res.data);

      if (res.data.success) {
        const s = res.data.student;

        sendWSMessage({
          type: "NEW_STUDENT",
          payload: {
            id: s._id,
            name: s.name,
            email: s.email,
            rollNo: s.rollNumber,
            className: s.course
          }
        });

        setMsg("Student added successfully!");
        setForm({
          name: "",
          email: "",
          rollNumber: "",
          course: ""
        });
      } else {
        setMsg("Failed to add student");
      }
    } catch (err) {
      setMsg("Error submitting form: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Student</h2>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form onSubmit={handleSubmit} style={formBox}>

        <label style={label}>Name</label>
        <input name="name" value={form.name} onChange={handleChange} style={input} required />

        <label style={label}>Email</label>
        <input name="email" value={form.email} onChange={handleChange} style={input} required />

        <label style={label}>Roll Number</label>
        <input name="rollNumber" value={form.rollNumber} onChange={handleChange} style={input} required />

        <label style={label}>Course / Class</label>
        <select name="course" value={form.course} onChange={handleChange} style={input} required>
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button disabled={loading} style={btn}>
          {loading ? "Saving..." : "Add Student"}
        </button>

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
  background: "green",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};
