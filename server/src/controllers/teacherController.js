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

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.json({ success: false, message: "Teacher not found" });
    }

    broadcast({ type: "UPDATE_TEACHER", payload: updated });

    res.json({ success: true, teacher: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Teacher.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ success: false, message: "Teacher not found" });
    }

    broadcast({ type: "DELETE_TEACHER", payload: id });

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};