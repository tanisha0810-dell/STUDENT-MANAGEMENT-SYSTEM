import express from "express";
import http from "http";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import cors from "cors";
import connectDB from "./config/db.js";
import { initWebSocketServer} from "./ws/wsServer.js";

import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);

app.get("/", (req, res) =>{
    res.send("Student Management System API running");
});

initWebSocketServer(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>{
    console.log("Server started");
})
