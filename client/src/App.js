import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Announcements from "./pages/Announcements";
import AddStudent from "./pages/AddStudent";
import AddCourse from "./pages/AddCourse";


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
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/announcements" element={
            <Announcements logs={logs} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

