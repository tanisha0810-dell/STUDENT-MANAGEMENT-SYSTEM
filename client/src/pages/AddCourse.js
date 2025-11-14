import { useState } from "react";
import api from "../services/api";
import { sendWSMessage } from "../webSocketClient";

export default function AddCourse() {
  const [form, setForm] = useState({
    name: "",
    code: ""
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
      const res = await api.post("/courses", form);
      console.log("Course added:", res.data);

      if (res.data.success) {
        const c = res.data.course;

        // 🔥 Notify all clients
        sendWSMessage({
          type: "NEW_COURSE",
          payload: {
            id: c._id,
            name: c.name,
            code: c.code
          }
        });

        setMsg("Course added successfully!");
        setForm({ name: "", code: "" });
      } else {
        setMsg("Failed to add course");
      }
    } catch (err) {
      setMsg("Error submitting form: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Course</h2>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form onSubmit={handleSubmit} style={formBox}>

        <label style={label}>Course Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          style={input}
          required
        />

        <label style={label}>Course Code</label>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          style={input}
          placeholder="Example: CS101"
          required
        />

        <button disabled={loading} style={btn}>
          {loading ? "Saving..." : "Add Course"}
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
