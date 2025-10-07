const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profileImage: {
      type: String,
      default: "",
    },
    role: { type: String, enum: ["admin", "super-admin"], default: "admin" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    verified: { type: Boolean, default: true },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    permissions: {
      type: [String],
      enum: ["manageStudents", "manageTeachers", "manageAlumni", "viewReports"],
      default: ["manageStudents", "manageTeachers", "manageAlumni"], 
    }
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
