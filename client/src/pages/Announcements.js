import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Announcements() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setList(res.data.announcements || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load announcements");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await api.delete("/announcements/" + id);
      loadAnnouncements();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={page}>
      <div style={topBar}>
        <h2>Announcements</h2>
        <Link to="/announcements/add" style={addBtn}>
          + Add Announcement
        </Link>
      </div>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      {list.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray" }}>
          No announcements yet.
        </p>
      ) : (
        <div style={listBox}>
          {list.map((a) => (
            <div key={a._id} style={card}>
              <h3 style={{ marginBottom: 5 }}>{a.title}</h3>
              <p style={{ marginBottom: 10 }}>{a.message}</p>
              <p style={{ fontSize: 13, color: "gray" }}>
                Audience: <b>{a.audience}</b>
              </p>
              <p style={{ fontSize: 12, color: "gray" }}>
                {new Date(a.createdAt).toLocaleString()}
              </p>

              <button
                style={delBtn}
                onClick={() => handleDelete(a._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const page = {
  padding: "20px",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
};

const addBtn = {
  background: "#007bff",
  padding: "8px 14px",
  color: "white",
  borderRadius: "6px",
  textDecoration: "none",
};

const listBox = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const card = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "15px",
  background: "#fff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const delBtn = {
  marginTop: "10px",
  background: "red",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
