const User = require("../model/registerUser/UserScehma");

// Example: replace later with actual DB model
async function getAllAdmins(req, res) {
  res.send("Get all Admins");
}

async function getAdminById(req, res) {
  try {
    const { id } = req.params;
    res.send(`Get Admin with ID: ${id}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function createAdmin(req, res) {
  try {
    const data = req.body;
    res.send(`Create Admin with data: ${JSON.stringify(data)}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function updateAdmin(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    res.send(`Update Admin ${id} with data: ${JSON.stringify(data)}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function deleteAdmin(req, res) {
  try {
    const { id } = req.params;
    res.send(`Delete Admin with ID: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function handleGetAllUsers(req, res) {
  try {
    const id = req.user?.id;
    const admin = await User.findById(id);

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    if (admin.role !== "admin")
      return res.status(403).json({ message: "Access denied. Admins only." });

    // Fetch users by role
    const students = await User.find({ role: "student" }).select("-password -__v");
    const teachers = await User.find({ role: "teacher" }).select("-password -__v");
    const alumni = await User.find({ role: "alumni" }).select("-password -__v");

    res.status(200).json({
      message: "Users successfully retrieved",
      counts: {
        total: students.length + teachers.length + alumni.length,
        students: students.length,
        teachers: teachers.length,
        alumni: alumni.length,
      },
      users: {
        students,
        teachers,
        alumni,
      },
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      message: "Internal server error while fetching users",
    });
  }
}

module.exports = {
  handleGetAllUsers
};
