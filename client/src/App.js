import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Announcements from "./pages/Announcements";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import AddCourse from "./pages/AddCourse";
import CourseList from "./pages/CourseList";
import CourseDashboard from "./pages/CourseDashboard";
import AssignTeacher from "./pages/AssignTeacher";
import EnrollStudents from "./pages/EnrollStudents";
import TeacherList from "./pages/TeacherList";
import AddTeacher from "./pages/AddTeacher";
import AddAnnouncement from "./pages/AddAnnouncement";



import { connectWebSocket } from "./webSocketClient";

function App() {
  const [logs, setLogs] = useState([]);
  const [role, setRole] = useState("admin"); // CHANGE LATER after login system

  useEffect(() => {
    connectWebSocket();

    window.wsCallback = (data) => {
      if (!data.type) return;
      setLogs((prev) => [...prev, data]);
    };
  }, []);

  return (
    <Router>
      <Navbar role={role} />

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/edit-student/:id" element={<EditStudent />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/announcements" element={<Announcements logs={logs} />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDashboard />} />
          <Route path="/courses/:id/assign-teacher" element={<AssignTeacher />} />
          <Route path="/courses/:id/enroll" element={<EnrollStudents />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
          {/* <Route path="/teachers/:id/edit" element={<UpdateTeacher />} />  */}
          <Route path="/assign-teacher" element={<AssignTeacher />} />
          <Route path="/announcements/add" element={<AddAnnouncement />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

