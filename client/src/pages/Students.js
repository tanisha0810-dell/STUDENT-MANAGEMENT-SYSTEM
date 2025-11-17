import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/students");

      const list = (res.data.students || []).map((s) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        rollNo: s.rollNumber,
        className: s.course?.name || s.course?.title || "—",
      }));

      setStudents(list);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ---- DELETE STUDENT ----
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/students/${id}`);

      setStudents((prev) => prev.filter((s) => s.id !== id));
      alert("Student deleted successfully!");
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    loadStudents();

    window.wsCallback = (data) => {
  if (!data?.type) return;

  if (data.type === "STUDENT_ADDED" || data.type === "NEW_STUDENT") {
    const p = data.payload;
    const normalized = {
      id: p._id,
      name: p.name,
      email: p.email,
      rollNo: p.rollNumber,
      className: p.course?.name || "",
    };
    setStudents((prev) => [normalized, ...prev]);
  }

  if (data.type === "STUDENT_UPDATED") {
    const u = data.payload;
    const updated = {
      id: u._id,
      name: u.name,
      email: u.email,
      rollNo: u.rollNumber,
      className: u.course?.name || "",
    };
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }

  if (data.type === "STUDENT_DELETED") {
    setStudents((prev) =>
      prev.filter((s) => s.id !== data.payload.id)
    );
  }
};


    return () => (window.wsCallback = undefined);
  }, []);

  return (
    <div>
      <h2>Students</h2>
      <p>List of all students in the system.</p>

      {loading && <p>Loading students…</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <Link to="/add-student">
        <button style={{ marginBottom: 20, padding: 10 }}>+ Add Student</button>
      </Link>

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#222", color: "white" }}>
              <th style={cell}>Name</th>
              <th style={cell}>Email</th>
              <th style={cell}>Class</th>
              <th style={cell}>Roll No</th>
              <th style={cell}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 12 }}>
                  No students found.
                </td>
              </tr>
            )}

            {students.map((s) => (
              <tr key={s.id} style={{ background: "#f7f7f7" }}>
                <td style={cell}>{s.name}</td>
                <td style={cell}>{s.email}</td>
                <td style={cell}>{s.className}</td>
                <td style={cell}>{s.rollNo}</td>
                <td style={cell}>
                  <button
                    style={btn}
                    onClick={() => navigate(`/edit-student/${s.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    style={{ ...btn, background: "red" }}
                    onClick={() => deleteStudent(s.id)}
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

const cell = {
  border: "1px solid #ccc",
  padding: "10px",
};

const btn = {
  padding: "5px 10px",
  marginRight: "5px",
  border: "none",
  background: "green",
  color: "white",
  cursor: "pointer",
  borderRadius: "4px",
};
