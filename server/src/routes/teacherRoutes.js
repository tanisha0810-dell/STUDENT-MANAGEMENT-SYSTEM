import express from "express";
import {addTeacher, getAllTeachers} from "../controllers/teacherController.js";

const router = express.Router();

router.post("/", addTeacher);
router.get("/", getAllTeachers);

export default router;
