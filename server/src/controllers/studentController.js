import Student from "../models/Student.js";
import Course from "../models/Course.js";
import { broadcast } from "../ws/wsServer.js";
import redis from "../utils/redisClient.js";


export const addStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, course } = req.body;

    const newStudent = await Student.create({
      name,
      email,
      rollNumber,
      course: course || null,
    });

    if (course) {
      await Course.findByIdAndUpdate(course, { $addToSet: { students: newStudent._id } });
    }

    const populated = await Student.findById(newStudent._id).populate("course", "name code");

    broadcast({ type: "STUDENT_ADDED", payload: populated });

    await redis.del("students:all");

    res.json({ success: true, student: populated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const cached = await redis.get("students:all");
    if (cached) {
      return res.json({ success: true, students: JSON.parse(cached), cached: true });
    }

    const students = await Student.find().populate("course", "name code");

    await redis.set("students:all", JSON.stringify(students), "EX", 3600);

    res.json({ success: true, students });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;

    const cached = await redis.get(`student:${id}`);
    if (cached) {
      return res.json({ success: true, student: JSON.parse(cached), cached: true });
    }

    const student = await Student.findById(id).populate("course", "name code");
    if (!student)
      return res.json({ success: false, message: "Student not found" });

    await redis.set(`student:${id}`, JSON.stringify(student), "EX", 3600);

    res.json({ success: true, student });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;

    const prev = await Student.findById(id);
    if (!prev)
      return res.json({ success: false, message: "Student not found" });

    const oldCourseId = prev.course ? String(prev.course) : null;
    const { course: newCourseId } = req.body;

    const student = await Student.findByIdAndUpdate(id, req.body, { new: true })
      .populate("course", "name code");

    if ((oldCourseId || "") !== (newCourseId || "")) {
      if (oldCourseId) {
        await Course.findByIdAndUpdate(oldCourseId, { $pull: { students: id } });
        const oldCourse = await Course.findById(oldCourseId)
          .populate("students", "name email rollNumber")
          .populate("teacher", "name email");
        broadcast({ type: "COURSE_UPDATED", payload: oldCourse });
      }

      if (newCourseId) {
        await Course.findByIdAndUpdate(newCourseId, { $addToSet: { students: id } });
        const newCourse = await Course.findById(newCourseId)
          .populate("students", "name email rollNumber")
          .populate("teacher", "name email");
        broadcast({ type: "COURSE_UPDATED", payload: newCourse });
      }
    }

    broadcast({ type: "STUDENT_UPDATED", payload: student });

    await redis.del("students:all");
    await redis.del(`student:${id}`);

    res.json({ success: true, student });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findByIdAndDelete(id);

    if (!student) return res.json({ success: false, message: "Not found" });

    await Course.updateMany({ students: id }, { $pull: { students: id } });

    broadcast({ type: "STUDENT_DELETED", payload: { id } });

    await redis.del("students:all");
    await redis.del(`student:${id}`);

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
