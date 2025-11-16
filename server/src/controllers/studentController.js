import Student from "../models/Student.js";
import Course from "../models/Course.js";
import { broadcast } from "../ws/wsServer.js";

/**
 * Add a student. If `course` is provided in body, also add the student id to that Course.students array.
 */
export const addStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, course } = req.body;

    const newStudent = await Student.create({
      name,
      email,
      rollNumber,
      course: course || null,
    });

    // If course provided, add student id to course.students for consistency
    if (course) {
      await Course.findByIdAndUpdate(course, { $addToSet: { students: newStudent._id } });
    }

    // Broadcast student added (populated student is better)
    const populated = await Student.findById(newStudent._id).populate("course", "name code");
    broadcast({ type: "STUDENT_ADDED", payload: populated });

    res.json({ success: true, student: populated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Get all students (populated with course)
 */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("course", "name code");
    res.json({ success: true, students });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Get single student by id (used by Edit form)
 */
export const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findById(id).populate("course", "name code");
    if (!student) return res.json({ success: false, message: "Student not found" });
    res.json({ success: true, student });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Update student. If course changed, update corresponding Course documents (remove from old, add to new).
 */
export const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;

    // load previous student to know old course
    const prev = await Student.findById(id);
    if (!prev) return res.json({ success: false, message: "Student not found" });

    const oldCourseId = prev.course ? String(prev.course) : null;
    const { course: newCourseId } = req.body;

    // Update student
    const student = await Student.findByIdAndUpdate(id, req.body, { new: true }).populate("course", "name code");

    // If course changed, maintain Course.students arrays
    if ((oldCourseId || "") !== (newCourseId || "")) {
      if (oldCourseId) {
        await Course.findByIdAndUpdate(oldCourseId, { $pull: { students: id } });
        const oldCourse = await Course.findById(oldCourseId).populate("students", "name email rollNumber").populate("teacher", "name email");
        broadcast({ type: "COURSE_UPDATED", payload: oldCourse });
      }
      if (newCourseId) {
        await Course.findByIdAndUpdate(newCourseId, { $addToSet: { students: id } });
        const newCourse = await Course.findById(newCourseId).populate("students", "name email rollNumber").populate("teacher", "name email");
        broadcast({ type: "COURSE_UPDATED", payload: newCourse });
      }
    }

    // Broadcast updated student
    broadcast({ type: "STUDENT_UPDATED", payload: student });

    res.json({ success: true, student });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Delete student: remove from DB and remove reference from any course.students
 */
export const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findByIdAndDelete(id);

    if (!student) return res.json({ success: false, message: "Not found" });

    // Remove from any course that contained this student
    await Course.updateMany({ students: id }, { $pull: { students: id } });

    // Broadcast delete events
    broadcast({ type: "STUDENT_DELETED", payload: { id } });

    // Optionally broadcast updated courses (you could fetch changed courses and broadcast, but updateMany does not return list)
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
