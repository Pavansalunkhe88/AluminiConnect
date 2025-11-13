const User = require("../model/registerUser/UserScehma");
const bcrypt = require("bcrypt");

async function handleUpdateStudentProfile(req, res) {
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

async function handleGetMyProfile(req, res) {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Fetch user safely
    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send safe response
    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/users/:id
async function handleGetUserById(req, res) {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Fetch minimal safe fields
    const user = await User.findById(id)
      .select("name email role about avatarUrl graduationYear department")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching public user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// async function handleGetProfile(req, res) {
//   try {
//     const { id } = req.params;
//     const viewerId = req.user.id;

//     const targetId = id || viewerId; // if /me or /:id

//     const projection =
//       viewerId === targetId
//         ? "-password -__v" // full profile if owner
//         : "name email role about avatarUrl";

//     const user = await User.findById(targetId).select(projection).lean();

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ user });
//   } catch (err) {
//     console.error("Error fetching profile:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }


async function handleStudentProfileDelete(req, res) {
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

    if (user.role.toLowerCase() !== "student") {
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
        { label: "Events Attended", value: Math.floor(Math.random() * 20) + 1 },
        { label: "Alumni Connections", value: Math.floor(Math.random() * 50) + 1 },
        { label: "Projects Completed", value: Math.floor(Math.random() * 10) + 1 }
      ],
      activities: [
        {
          type: "connection",
          title: "New Connection",
          description: "Connected with alumni from Tech Corp",
          timestamp: "2 hours ago"
        },
        {
          type: "event",
          title: "Event Registration",
          description: "Registered for Career Workshop",
          timestamp: "1 day ago"
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
  handleUpdateStudentProfile,
  handleGetMyProfile,
  handleStudentProfileDelete,
  handleGetUserById,
  handleGetDashboardData
};
