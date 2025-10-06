const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    studentId: { type: String, required: true },
    profileImage: {
      type: String,
      default: "",
    },
    graduationYear: { type: String, required: true },
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
    currentCompany: { type: String },
    currentPosition: { type: String },
    linkedin: { type: String },
    contact: { type: String },
    role: { type: String, enum: ["alumni"], default: "alumni" },
    skills: { type: [String] },
    achievements: { type: [String] },
    location: { type: String },
    isActive: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Alumni = mongoose.model("Alumni", alumniSchema);

module.exports = Alumni;
