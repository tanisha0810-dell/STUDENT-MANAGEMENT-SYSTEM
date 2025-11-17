import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    subject: {type: String, required: true},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null }
});

export default mongoose.model("Teacher", teacherSchema);