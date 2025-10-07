const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    profileImage: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      enum: [
        "Computer Science and Engineering",
        "Information Technology",
        "Electronics and Telecommunication",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electrical Engineering",
        "Artificial Intelligence and Data Science",
        "Instrumentation Engineering",
      ],
      required: true,
    },
    address: { type: String }, 
    batch: { type: String, required: true },
    course: { type: String },
    contact: { type: String },
    role: { type: String, enum: ["student"], default: "student" },
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
