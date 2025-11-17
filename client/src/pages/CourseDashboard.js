import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function CourseDashboard(){
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${id}`);
      if (res.data.success) setCourse(res.data.course);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    window.wsCallback = (data) => {
      if (!data?.type) return;
      if (data.type === "COURSE_UPDATED" && data.payload._id === id) setCourse(data.payload);
    };
    return () => { window.wsCallback = undefined; };
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{course.name} — {course.code}</h2>
      <p>Teacher: {course.teacher ? `${course.teacher.name} (${course.teacher.email})` : "Not assigned"}</p>

      <h3>Students ({(course.students || []).length})</h3>
      <ul>
        {(course.students || []).map(s => (
          <li key={s._id}>{s.name} — {s.email} — {s.rollNumber}</li>
        ))}
      </ul>

      <div style={{ marginTop: 12 }}>
        <Link to={`/courses/${id}/enroll`}><button style={smallBtn}>Enroll/Remove Students</button></Link>
      </div>
    </div>
  );
}

const smallBtn = { padding: "6px 10px", marginRight: 8, background: "#007bff", color: "white", border: "none", borderRadius: 4 };
