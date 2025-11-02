const User = require("../model/registerUser/UserScehma");
const bcrypt = require("bcrypt");

async function getAllStudents(req, res) {
  res.send("Get all Students");
}

async function getStudentById(req, res) {
  const { id } = req.params;
  res.send(`Get Student with ID: ${id}`);
}

async function createStudent(req, res) {
  const data = req.body;
  res.send(`Create Student with data: ${JSON.stringify(data)}`);
}

async function handleUpdateStudent(req, res) {
  try {
    const id = req.user?.id;
    
    const student = await User.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { name, email, password } = req.body;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (password) {
      student.password = await bcrypt.hash(password, 10);
    }

    await student.save();

    const { password: _, __v, ...safeStudent } = student.toObject;
    res
      .status(200)
      .json({ message: "Student updated successfully", student: safeStudent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function deleteStudent(req, res) {
  const { id } = req.params;
  res.send(`Delete Student with ID: ${id}`);
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  handleUpdateStudent,
  deleteStudent,
};
