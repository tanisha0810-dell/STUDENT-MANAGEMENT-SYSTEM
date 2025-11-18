import Teacher from "../models/Teacher.js";
import Course from "../models/Course.js";
import { broadcast } from "../ws/wsServer.js";
import redis from "../utils/redisClient.js";


export const addTeacher = async (req, res) => {
  try {
    const { name, email, subject, courseId } = req.body;

    let teacher = await Teacher.create({
      name,
      email,
      subject,
      courseId: courseId || null
    });

    let assignedCourse = null;

    if (!courseId) {
      assignedCourse = await Course.findOne({
        subject: { $regex: new RegExp("^" + subject + "$", "i") }
      });
    } else {
      assignedCourse = await Course.findById(courseId);
    }

    if (assignedCourse) {
      if (assignedCourse.teacher) {
        await Teacher.findByIdAndUpdate(assignedCourse.teacher, { courseId: null });
      }

      assignedCourse.teacher = teacher._id;
      await assignedCourse.save();

      teacher.courseId = assignedCourse._id;
      await teacher.save();
    }

    await redis.del("teachers:all");

    return res.json({
      success: true,
      message: "Teacher added successfully",
      teacher
    });

  } catch (error) {
    console.log("Add teacher error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getAllTeachers = async (req, res) => {
  try {
    const cached = await redis.get("teachers:all");
    if (cached) {
      return res.json({ success: true, teachers: JSON.parse(cached), cached: true });
    }

    const teachers = await Teacher.find().populate("courseId", "name code");

    await redis.set("teachers:all", JSON.stringify(teachers), "EX", 3600);

    res.json({ success: true, teachers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getTeacherById = async (req, res) => {
  try {
    const id = req.params.id;

    const cached = await redis.get(`teacher:${id}`);
    if (cached) {
      return res.json({ success: true, teacher: JSON.parse(cached), cached: true });
    }

    const teacher = await Teacher.findById(id).populate("courseId", "name code");
    if (!teacher) return res.json({ success: false, message: "Teacher not found" });

    await redis.set(`teacher:${id}`, JSON.stringify(teacher), "EX", 3600);

    res.json({ success: true, teacher });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const updateTeacher = async (req, res) => {
  try {
    const { name, email, subject, courseId } = req.body;

    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.json({ success: false, message: "Teacher not found" });

    teacher.name = name ?? teacher.name;
    teacher.email = email ?? teacher.email;
    teacher.subject = subject ?? teacher.subject;

    let newCourse = null;

    if (courseId) {
      newCourse = await Course.findById(courseId);
    }

    if (!newCourse) {
      newCourse = await Course.findOne({
        $or: [{ name: teacher.subject }, { subject: teacher.subject }]
      });
    }

    if (teacher.courseId &&
        (!newCourse || String(teacher.courseId) !== String(newCourse._id))) {
      await Course.findByIdAndUpdate(teacher.courseId, { teacher: null });
    }

    if (newCourse) {
      teacher.courseId = newCourse._id;
      await newCourse.updateOne({ teacher: teacher._id });
    } else {
      teacher.courseId = null;
    }

    await teacher.save();

    broadcast({ type: "UPDATE_TEACHER", payload: teacher });

    await redis.del("teachers:all");
    await redis.del(`teacher:${teacher._id}`);

    res.json({ success: true, teacher });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const deleteTeacher = async (req, res) => {
  try {
    const id = req.params.id;

    const teacher = await Teacher.findById(id);
    if (!teacher) return res.json({ success: false, message: "Teacher not found" });

    if (teacher.courseId) {
      await Course.findByIdAndUpdate(teacher.courseId, { teacher: null });
    }

    await Teacher.findByIdAndDelete(id);

    broadcast({ type: "DELETE_TEACHER", payload: id });

    await redis.del("teachers:all");
    await redis.del(`teacher:${id}`);

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
