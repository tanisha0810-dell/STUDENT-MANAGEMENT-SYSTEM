import express from "express";
import { addStudent, getAllStudents } from "../controllers/studentController.js";

const router = express.Router();    

router.post("/", addStudent);
router.get("/", getAllStudents);
router.put("/:id", updateStudent);   
router.delete("/:id", deleteStudent);

export default router;