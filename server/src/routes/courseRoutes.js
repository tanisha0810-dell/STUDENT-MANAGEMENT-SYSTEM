import express from "express";
import {
  addCourse,
  getAllCourses,
  addStudentToCourse,
  removeStudentFromCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", addCourse);
router.get("/", getAllCourses);
router.post("/:courseId/add-student", addStudentToCourse);
router.post("/:courseId/remove-student", removeStudentFromCourse);

export default router;
