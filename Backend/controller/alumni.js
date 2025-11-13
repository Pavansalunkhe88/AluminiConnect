const User = require("../model/registerUser/UserScehma");
const bcrypt = require("bcrypt");
const Alumni = require("../model/Alumni");
const { handleAddRemoveArray } = require("../utils/profileDataArray");

async function getAllAlumni(req, res) {
  res.send("Get all Alumni");
}

async function getAlumniById(req, res) {
  const { id } = req.params;
  res.send(`Get Alumni with ID: ${id}`);
}

async function createAlumni(req, res) {
  const data = req.body;
  res.send(`Create Alumni with data: ${JSON.stringify(data)}`);
}

async function handleUpdateAlumniProfile(req, res) {
  try {
    const id = req.user?.id;
    const { email, password, name } = req.body;

    const alumni = await User.findById(id);

    if (!alumni) return res.status(404).json({ message: "Alumni not found" });

    if (alumni.role !== "alumni")
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (email) alumni.email = email;
    if (name) alumni.name = name;
    if (password) alumni.password = await bcrypt.hash(password, 10);

    await alumni.save();

    const { password: _, __v, ...safeAlumni } = alumni.toObject();

    res.status(200).json({
      message: "Alumni updated sucessfully",
      alumni: safeAlumni,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

async function handleInsertDataToAlumniModel(req, res) {
  try {
    const userId = req.user.id; // from JWT
    const role = req.user.role;

    // Only alumni role can modify this profile
    if (role !== "Alumni") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if alumni profile already exists
    let alumni = await Alumni.findOne({ user: userId });

    // If profile does not exist -> create
    if (!alumni) {
      alumni = new Alumni({ user: userId });
    }

    // Ownership check (extra safety)
    if (alumni.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to modify this profile" });
    }

    // Fields allowed to update
    const allowedFields = [
      "profileImage",
      "coverImage",
      "graduationYear",
      "department",
      "currentCompany",
      "currentPosition",
      "linkedin",
      "contact",
      "location",
      "bio",
    ];

    // Update simple fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        alumni[field] = req.body[field];
      }
    });

    // Handle arrays with "add-remove" logic
    if (req.body.skills) {
      alumni.skills = handleAddRemoveArray(alumni.skills || [], req.body.skills);
    }
    if (req.body.achievements) {
      alumni.achievements = handleAddRemoveArray(
        alumni.achievements || [],
        req.body.achievements
      );
    }
    if (req.body.contributions) {
      alumni.contributions = handleAddRemoveArray(
        alumni.contributions || [],
        req.body.contributions
      );
    }

    // Save new/updated profile
    await alumni.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: alumni,
    });
  } catch (err) {
    console.error("Error updating alumni profile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function handleDeleteAlumni(req, res) {
  try {
    const id = req.user?.id;
    const deletedAlumni = await User.findByIdAndDelete(id);

    if (!deletedAlumni)
      return res.status(404).json({ message: "Alumni not found" });

    res
      .status(200)
      .json({ message: "Deleted alumni sucessfully", deleteAlumni });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

async function handleGetUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User retrieved sucessfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

async function handleGetProfile(req, res) {
  try {
    const id = req.user?.id;
    const alumniProfile = await User.findById(id).select("-password -__v");
    if (!alumniProfile)
      return res.status(404).json({ message: "Can't find User" });
    res
      .status(200)
      .json({ message: "User retrieved sucessfuly", alumniProfile });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

// async function deleteAlumni(req, res) {
//   const { id } = req.params;
//   res.send(`Delete Alumni with ID: ${id}`);
// }

async function handleGetDashboardData(req, res) {
  try {
    const userId = req.user.id;

    // Mock dynamic data - in real app, this would come from database
    const dashboardData = {
      stats: [
        { label: "Students Mentored", value: Math.floor(Math.random() * 10) + 1 },
        { label: "Events Hosted", value: Math.floor(Math.random() * 5) + 1 },
        { label: "Resources Shared", value: Math.floor(Math.random() * 20) + 1 },
        { label: "Network Size", value: Math.floor(Math.random() * 150) + 50 }
      ],
      activities: [
        {
          type: "mentorship",
          title: "New Mentee",
          description: "Started mentoring a student",
          timestamp: "3 hours ago"
        },
        {
          type: "post",
          title: "Career Insight",
          description: "Posted about industry trends",
          timestamp: "2 days ago"
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
  getAllAlumni,
  getAlumniById,
  createAlumni,
  handleUpdateAlumniProfile,
  handleDeleteAlumni,
  handleGetUserById,
  handleGetProfile,
  handleGetDashboardData
};
