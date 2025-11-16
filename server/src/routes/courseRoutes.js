import express from "express";
import {
  addCourse,
  getAllCourses,
  getCourseById,
  addStudentToCourse,
  removeStudentFromCourse,
  assignTeacherToCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", addCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

router.post("/:id/assign-teacher", assignTeacherToCourse);
router.post("/:id/add-student", addStudentToCourse);
router.post("/:id/remove-student", removeStudentFromCourse);

export default router;
