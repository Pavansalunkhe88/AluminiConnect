const User = require("../model/registerUser/UserScehma");
const bcrypt = require("bcrypt");

async function handleDeleteTeacher(req, res) {
  const { id } = req.params;
  res.send(`Delete Teacher with ID: ${id}`);
}

async function handleGetMyProfile(req, res) {
  try {
    const id = req.user.id;

    const teacher = await User.findById(id).select("-password -__v");
    if (!teacher)
      return res.status(404).json({ message: "Teacher not found." });

    res
      .status(200)
      .json({ message: "Teacher retrieved successfully", teacher });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

async function handleGetTeacherProfileToUpdate(req, res) {
  try {
    const id = req.user?.id;
    const teacher = await User.findById(id).select("-password -__v");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json({
      message: "Teacher data fetched successfully for update",
      teacher,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleUpdateTeacherProfile(req, res) {
  try {
    const id = req.user?.id;
    if (!id) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const teacher = await User.findById(id).select("-password -__v");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { name, email, password } = req.body;

    // Optional: Basic validation before applying changes
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // if (name) teacher.name = name.trim();
    // if (email) teacher.email = email.toLowerCase();

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if(email) teacher.email = email;
    if(name) teacher.name = name;

    if (password) {
      // Hash password securely
      const hashedPassword = await bcrypt.hash(password, 10);
      teacher.password = hashedPassword;
    }

    await teacher.save();

    // Exclude sensitive fields in response
    const { password: _, __v, ...safeTeacher } = teacher.toObject();

    return res.status(200).json({
      message: "Profile updated successfully",
      teacher: safeTeacher,
    });
  } catch (err) {
    console.error("Error updating teacher profile:", err);
    return res.status(500).json({ message: "Something went wrong on server" });
  }
}

async function handleTeacherProfileDelete(req, res) {
  try {
    const id = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required to delete account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role.toLowerCase() !== "teacher") {
      return res.status(403).json({ message: "You are not authorized to delete this account" });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Delete user after password match
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}


async function handleGetDashboardData(req, res) {
  try {
    const userId = req.user.id;

    // Mock dynamic data - in real app, this would come from database
    const dashboardData = {
      stats: [
        { label: "Students Taught", value: Math.floor(Math.random() * 100) + 50 },
        { label: "Events Organized", value: Math.floor(Math.random() * 15) + 5 },
        { label: "Resources Created", value: Math.floor(Math.random() * 25) + 10 },
        { label: "Alumni Network", value: Math.floor(Math.random() * 200) + 100 }
      ],
      activities: [
        {
          type: "event",
          title: "Career Fair",
          description: "Organized annual career fair",
          timestamp: "1 week ago"
        },
        {
          type: "mentorship",
          title: "Mentorship Program",
          description: "Launched new mentorship initiative",
          timestamp: "2 weeks ago"
        }
      ]
    };

    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      data: dashboardData
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleDeleteTeacher,
  //handleGetTeacherProfile,
  handleGetTeacherProfileToUpdate,
  handleUpdateTeacherProfile,
  handleTeacherProfileDelete,
  handleGetDashboardData
};
