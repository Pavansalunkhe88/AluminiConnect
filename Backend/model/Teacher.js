const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    profileImage: {
      type: String,
      default: "",
    },
    designation: { type: String },
    contact: { type: String },
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
    specialization: {
      type: [String],
      enum: [
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Web Development",
        "Cyber Security",
        "Embedded Systems",
        "IoT",
        "Blockchain",
        "Software Engineering",
        "Database Management",
        "Data Structure & Algorithm",
      ],
      required: true,
    },
    role: { type: String, enum: ["teacher"], default: "teacher" },
    experienceYears: { type: Number },
    qualifications: { type: String },
    isActive: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
