import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { initWebSocketServer} from "./ws/wsServer.js";
import { connectRedis } from "./utils/redisClient.js";


import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import announcementRoutes from "./routes/AnnouncementRoutes.js";
import bullQueueRoutes from "./routes/bullQueueRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();
app.use(cors());
app.use(express.json());
connectRedis();

app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);

app.use("/api/announcements", announcementRoutes);
app.use("/api/bullmq", bullQueueRoutes);


app.get("/", (req, res) =>{
    res.send("Student Management System API running");
});

initWebSocketServer(server);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>{
    console.log(`Server started on port ${PORT}`);
})
