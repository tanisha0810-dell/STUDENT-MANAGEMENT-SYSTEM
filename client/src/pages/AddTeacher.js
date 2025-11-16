import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddTeacher() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Saving...");

    try {
      const res = await api.post("/teachers", form);
      if (res.data.success) {
        setMsg("Teacher added!");
        setTimeout(() => navigate("/teachers"), 800);
      } else setMsg("Failed to save.");
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2>Add Teacher</h2>
        {msg && <p style={{ color: "green" }}>{msg}</p>}

        <form onSubmit={handleSubmit} style={formBox}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} style={input} required />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} style={input} required />

          <label>Subject</label>
          <input name="subject" value={form.subject} onChange={handleChange} style={input} required />

          <button style={btn}>Add Teacher</button>
        </form>
      </div>
    </div>
  );
}

const page = { display: "flex", justifyContent: "center", paddingTop: 40 };
const card = { width: 400, padding: 25, background: "#fff", borderRadius: 10, boxShadow: "0 3px 10px rgba(0,0,0,0.2)" };
const formBox = { display: "flex", flexDirection: "column", gap: 12 };
const input = { padding: 10, borderRadius: 6, border: "1px solid #bbb" };
const btn = { padding: 12, background: "#007bff", color: "white", border: "none", borderRadius: 6 };
