import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddAnnouncement() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/announcements", form);
      if (res.data.success) {
        navigate("/announcements");
      } else {
        setMsg("Failed to create announcement");
      }
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2>Add Announcement</h2>
        {msg && <p style={{ color: "red" }}>{msg}</p>}

        <form onSubmit={handleSubmit} style={formBox}>
          <label style={label}>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            style={input}
            required
          />

          <label style={label}>Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            style={textarea}
            required
          />

          <label style={label}>Audience</label>
          <select
            name="audience"
            value={form.audience}
            onChange={handleChange}
            style={input}
          >
            <option value="all">All</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
          </select>

          <button style={btn}>Create</button>
        </form>
      </div>
    </div>
  );
}

const page = {
  display: "flex",
  justifyContent: "center",
  paddingTop: 30,
};

const card = {
  width: "450px",
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
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

const textarea = {
  padding: "10px",
  minHeight: "90px",
  borderRadius: "6px",
  border: "1px solid #bbb",
};

const btn = {
  padding: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
};
