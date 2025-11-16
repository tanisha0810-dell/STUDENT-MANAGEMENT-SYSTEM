import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function EnrollStudents(){
  const { id } = useParams();
  const [allStudents, setAllStudents] = useState([]);
  const [course, setCourse] = useState(null);

  const load = async () => {
    const [sRes, cRes] = await Promise.all([api.get("/api/students"), api.get(`/api/courses/${id}`)]);
    if (sRes.data.success) setAllStudents(sRes.data.students);
    if (cRes.data.success) setCourse(cRes.data.course);
  };

  useEffect(() => { load(); }, [id]);

  const enroll = async (studentId) => {
    try {
      const res = await api.post(`/api/courses/${id}/add-student`, { studentId });
      if (res.data.success) setCourse(res.data.course);
    } catch (err) { alert(err.message); }
  };

  const remove = async (studentId) => {
    try {
      const res = await api.post(`/api/courses/${id}/remove-student`, { studentId });
      if (res.data.success) setCourse(res.data.course);
    } catch (err) { alert(err.message); }
  };

  if (!course) return <p>Loading...</p>;

  const enrolledIds = new Set((course.students||[]).map(s=>s._id));

  return (
    <div style={{ padding: 20 }}>
      <h2>Enroll / Remove Students — {course.name}</h2>

      <h3>Enrolled</h3>
      <ul>
        {(course.students || []).map(s => (
          <li key={s._id}>
            {s.name} — {s.email}
            <button style={{ marginLeft: 8 }} onClick={() => remove(s._id)}>Remove</button>
          </li>
        ))}
      </ul>

      <h3>All Students</h3>
      <ul>
        {allStudents.map(s => (
          <li key={s._id}>
            {s.name} — {s.email}
            {!enrolledIds.has(s._id) && <button style={{ marginLeft: 8 }} onClick={() => enroll(s._id)}>Enroll</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
