import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import { broadcast } from "../ws/wsServer.js";
/**
 * Create course
 */
export const addCourse = async (req, res) => {
  try {
    const { name, code, teacher, students } = req.body;

    const course = await Course.create({
      name,
      code,
      teacher: teacher || null,
      students: students || [],
    });

    const populated = await Course.findById(course._id).populate("teacher", "name email").populate("students", "name email rollNumber");

    broadcast({ type: "NEW_COURSE", payload: populated });

    res.json({ success: true, course: populated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Get all courses (populated)
 */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("students", "name email rollNumber")
      .populate("teacher", "name email");

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Add a student to course (also update Student.course)
 */
export const addStudentToCourse = async (req, res) => {
  try {
    // accept multiple possible param names
    const courseId = req.params.courseId || req.params.courseid || req.params.id;
    const { studentId } = req.body;

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: studentId } },
      { new: true }
    )
      .populate("teacher", "name email")
      .populate("students", "name email rollNumber");

    if (!updated) {
      return res.json({ success: false, message: "Course not found" });
    }

    await Student.findByIdAndUpdate(studentId, { course: updated._id });

    broadcast({ type: "COURSE_UPDATED", payload: updated });

    res.json({ success: true, course: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Remove a student from course (also clear Student.course if it was this course)
 */
export const removeStudentFromCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.params.courseid || req.params.id;
    const { studentId } = req.body;

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { students: studentId } },
      { new: true }
    )
      .populate("teacher", "name email")
      .populate("students", "name email rollNumber");

    if (!updated) {
      return res.json({ success: false, message: "Course not found" });
    }

    const stu = await Student.findById(studentId);
    if (stu && String(stu.course) === String(courseId)) {
      await Student.findByIdAndUpdate(studentId, { course: null });
    }

    broadcast({ type: "COURSE_UPDATED", payload: updated });

    res.json({ success: true, course: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Assign a teacher to a course
 */

// Assign Teacher to Course (Complete 2-way Sync)
export const assignTeacherToCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { teacherId } = req.body;

    const course = await Course.findById(courseId);
    const teacher = await Teacher.findById(teacherId);

    if (!course || !teacher) {
      return res.status(404).json({ success: false, message: "Course or Teacher not found" });
    }

    if (teacher.courseId && teacher.courseId.toString() !== courseId) {
      await Course.findByIdAndUpdate(teacher.courseId, { teacher: null });
    }

    if (course.teacher && course.teacher.toString() !== teacherId) {
      await Teacher.findByIdAndUpdate(course.teacher, { courseId: null });
    }
    course.teacher = teacherId;
    teacher.courseId = courseId;

    await course.save();
    await teacher.save();

    return res.json({ success: true, message: "Teacher assigned successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



/**
 * Get course by id
 */
export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.params.courseid || req.params.id;
    const course = await Course.findById(courseId)
    .select("name code subject teacher students")
    .populate("teacher", "name email")
    .populate("students", "name email rollNumber");
    if (!course) return res.json({ success: false, message: "Course not found" });
    res.json({ success: true, course });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
