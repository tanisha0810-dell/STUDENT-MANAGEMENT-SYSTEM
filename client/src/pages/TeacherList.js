import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/teachers");
      if (res.data.success) setTeachers(res.data.teachers);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      const res = await api.delete(`/teachers/${id}`);
      if (res.data.success) load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Teachers</h2>
      <Link to="/add-teacher">
        <button style={btn}>+ Add Teacher</button>
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={table}>
          <thead>
            <tr style={{ background: "#222", color: "white" }}>
              <th style={cell}>Name</th>
              <th style={cell}>Email</th>
              <th style={cell}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {teachers.map((t) => (
              <tr key={t._id} style={{ background: "#f7f7f7" }}>
                <td style={cell}>{t.name}</td>
                <td style={cell}>{t.email}</td>
                <td style={cell}>
                  <Link to={`/teachers/${t._id}/edit`}>
                    <button style={smallBtn}>Edit</button>
                  </Link>

                  <button
                    onClick={() => deleteTeacher(t._id)}
                    style={{ ...smallBtn, background: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const btn = {
  padding: "8px 12px",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: 6,
  marginBottom: 15
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 10
};

const cell = {
  padding: 10,
  border: "1px solid #ccc"
};

const smallBtn = {
  padding: "6px 10px",
  marginRight: 6,
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer"
};
