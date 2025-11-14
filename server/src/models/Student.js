import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    rollNumber: {type: String, required: true, unique: true},
    course: {type: mongoose.Schema.Types.ObjectId, ref: "Course"},
    attendance: [{type: mongoose.Schema.Types.ObjectId, ref: "Attendance"}],
});

export default mongoose.model("Student", studentSchema);