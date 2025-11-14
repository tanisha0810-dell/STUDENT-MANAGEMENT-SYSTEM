import Course from "../models/Course.js";
import { broadcast } from "../ws/wsServer.js";

export const addCourse = async (req, res) => {
  try {
    const { name, code, teacher, students } = req.body;

    const course = await Course.create({
      name,
      code,
      teacher: teacher || null,
      students: students || [],
    });

    broadcast({ type: "NEW_COURSE", payload: course });

    res.json({ success: true, course });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher")
      .populate("students");

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addStudentToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: studentId } },
      { new: true }
    )
      .populate("teacher")
      .populate("students");

    if (!updated) {
      return res.json({ success: false, message: "Course not found" });
    }

    broadcast({ type: "COURSE_UPDATED", payload: updated });

    res.json({ success: true, course: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeStudentFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { students: studentId } },
      { new: true }
    )
      .populate("teacher")
      .populate("students");

    if (!updated) {
      return res.json({ success: false, message: "Course not found" });
    }

    broadcast({ type: "COURSE_UPDATED", payload: updated });

    res.json({ success: true, course: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
