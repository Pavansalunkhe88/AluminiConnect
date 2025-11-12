const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
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
        "Chemical Engineering",
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
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
