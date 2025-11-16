import express from "express";
import {addTeacher, getAllTeachers, updateTeacher, deleteTeacher} from "../controllers/teacherController.js";

const router = express.Router();

router.post("/", addTeacher);
router.get("/", getAllTeachers);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);


export default router;
