const mongoose = require("mongoose");
const User = require("../model/registerUser/UserScehma");

async function handleGetDirectory(req, res) {
  try {
    const userRole = req.user?.role?.toLowerCase();
    const { role: requestedRole, search } = req.query;

    // Access control
    let allowedRoles = [];
    if (userRole === 'student') {
      allowedRoles = ['alumni'];
    } else if (userRole === 'alumni') {
      allowedRoles = ['student'];
    } else if (userRole === 'teacher' || userRole === 'admin') {
      allowedRoles = ['student', 'alumni'];
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (!allowedRoles.includes(requestedRole?.toLowerCase())) {
      return res.status(403).json({ message: "You cannot access this directory" });
    }

    // Build query
    let query = { role: new RegExp(`^${requestedRole}$`, 'i') };

    if (search) {
      query.name = new RegExp(search, 'i'); // Search by name (case-insensitive)
    }

    const users = await User.find(query).select("-password -__v").sort({ name: 1 });

    res.status(200).json({
      message: "Directory retrieved successfully",
      users
    });
  } catch (err) {
    console.error("Error fetching directory:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

module.exports = {
  handleGetDirectory
};
