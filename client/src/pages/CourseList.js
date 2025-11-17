import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      if (res.data.success) setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();

    window.wsCallback = (data) => {
      if (!data?.type) return;
      if (data.type === "NEW_COURSE") {
        setCourses(prev => [data.payload, ...prev]);
      }
      if (data.type === "COURSE_UPDATED") {
        setCourses(prev => prev.map(c => c._id === data.payload._id ? data.payload : c));
      }
    };

    return () => { window.wsCallback = undefined; };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Courses</h2>
      <Link to="/add-course"><button style={btn}>+ Add Course</button></Link>
      {loading ? <p>Loading...</p> : (
        <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#222", color: "white" }}>
              <th style={cell}>Name</th>
              <th style={cell}>Code</th>
              <th style={cell}>Teacher</th>
              <th style={cell}>Students</th>
              <th style={cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c._id} style={{ background: "#f7f7f7" }}>
                <td style={cell}>{c.name}</td>
                <td style={cell}>{c.code}</td>
                <td style={cell}>{c.teacher ? c.teacher.name : "—"}</td>
                <td style={cell}>{(c.students || []).length}</td>
                <td style={cell}>
                  <Link to={`/courses/${c._id}`}><button style={smallBtn}>Open</button></Link>
                  {/* <Link to={`/courses/${c._id}/assign-teacher`}><button style={smallBtn}>Assign</button></Link> */}
                  <Link to={`/courses/${c._id}/enroll`}><button style={smallBtn}>Enroll</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const cell = { padding: 10, border: "1px solid #ccc" };
const btn = { padding: "8px 12px", background: "green", color: "white", border: "none", borderRadius: 6 };
const smallBtn = { padding: "6px 10px", marginRight: 6, background: "#007bff", color: "white", border: "none", borderRadius: 4 };
