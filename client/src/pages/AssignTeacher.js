import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AssignTeacher(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    api.get("/api/teachers") // assumes you have this API
      .then(res => { if(res.data.success) setTeachers(res.data.teachers); })
      .catch(console.error);
  }, []);

  const assign = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/courses/${id}/assign-teacher`, { teacherId: selected });
      if (res.data.success) {
        alert("Teacher assigned");
        navigate(`/courses/${id}`);
      } else alert("Failed: " + res.data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Assign Teacher</h2>
      <form onSubmit={assign}>
        <select value={selected} onChange={e=>setSelected(e.target.value)} required>
          <option value="">Select teacher</option>
          {teachers.map(t => <option key={t._id} value={t._id}>{t.user?.name || t.name || t._id}</option>)}
        </select>
        <button style={{ marginLeft: 10 }}>Assign</button>
      </form>
    </div>
  );
}
