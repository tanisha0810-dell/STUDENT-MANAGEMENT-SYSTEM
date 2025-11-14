import Student from "../models/Student.js";
import { broadcast } from "../ws/wsServer.js";

export const addStudent = async (req, res) => {
    try {
        const { name, email, rollNumber, course } = req.body;

        const newStudent = await Student.create({
            name,
            email,
            rollNumber,
            course,
        });

        broadcast({ type: "NEW_STUDENT", payload: newStudent });

        res.json({ success: true, student: newStudent });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate("course");
        res.json({ success: true, students });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!student) return res.json({ success: false, message: "Not found" });

    broadcast({
      type: "STUDENT_UPDATED",
      payload: student
    });

    res.json({ success: true, student });
  }
  catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) return res.json({ success: false, message: "Not found" });

    broadcast({
      type: "STUDENT_DELETED",
      payload: { id: req.params.id }
    });

    res.json({ success: true });
  }
  catch (error) {
    res.json({ success: false, message: error.message });
  }
};
