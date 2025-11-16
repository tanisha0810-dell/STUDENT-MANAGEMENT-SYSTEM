import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/teachers/" + id);
        if (res.data.success) {
          setForm(res.data.teacher);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
          <input name="name" value={form.name} onChange={handleChange} style={input} required />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} style={input} required />

          <button style={btn}>Save Changes</button>
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
