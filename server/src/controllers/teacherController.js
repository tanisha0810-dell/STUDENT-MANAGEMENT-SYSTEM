import Teacher from "../models/Teacher.js";
import { broadcast } from "../ws/wsServer.js";

export const addTeacher = async (req, res) => {
  try {
    const { name, email, subject } = req.body;
    const teacher = await Teacher.create({ name, email, subject });

    broadcast({ type: "NEW_TEACHER", payload: teacher });

    res.json({ success: true, teacher });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json({ success: true, teachers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};