const User = require("../model/registerUser/UserScehma");
const bcrypt = require("bcrypt");
const Student = require("../model/Student");
const { handleAddRemoveArray } = require("../utils/profileDataArray");
const cloudinary = require("../utils/cloudinaryConfig");
const fs = require("fs");

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


async function handleInsertDataToStudentModel(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    console.log("BODY →", req.body);
    console.log("FILES →", req.files);

    // Only Student can modify student profile
    if (role !== "Student") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if profile exists
    let student = await Student.findOne({ user: userId });

    // Create if not exists
    if (!student) {
      student = new Student({ user: userId });
    }

    // Ownership check
    if (student.user.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to modify this profile",
      });
    }

    const uploadToCloudinary = async (file, folder) => {
      const upload = await cloudinary.uploader.upload(file.path, {
        folder,
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
      });

      fs.unlinkSync(file.path);

      return {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    };

    // profileImage
    if (req.files?.profileImage?.length > 0) {
      const file = req.files.profileImage[0];

      if (student.profileImage?.public_id) {
        await cloudinary.uploader.destroy(student.profileImage.public_id);
      }

      student.profileImage = await uploadToCloudinary(file, "student_profiles");
    }

    // coverImage
    if (req.files?.coverImage?.length > 0) {
      const file = req.files.coverImage[0];

      if (student.coverImage?.public_id) {
        await cloudinary.uploader.destroy(student.coverImage.public_id);
      }

      student.coverImage = await uploadToCloudinary(file, "student_covers");
    }

    const allowed = [
      "department",
      "bio",
      "achievements",
      "batch",
      "course",
      "address",
      "contact",
      "currentYear",
      "skills",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        student[field] = req.body[field];
      }
    });

    if (req.body.skills) {
      student.skills = handleAddRemoveArray(
        student.skills || [],
        req.body.skills
      );
    }

    if (req.body.achievements) {
      student.achievements = handleAddRemoveArray(
        student.achievements || [],
        req.body.achievements
      );
    }

    await student.save();

    res.status(200).json({
      message: "Student profile updated successfully",
      profile: student,
    });
  } catch (err) {
    console.error("Student Update Error:", err);

    // cleanup temp file if failed
    try {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (unlinkErr) {
      console.warn("Cleanup failed:", unlinkErr.message);
    }

    return res.status(500).json({ message: "Something went wrong." });
  }
}

async function handleGetStudentProfile(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role.toLowerCase();

    console.log("INSIDE GET STUDENT PROFILE:", userId, role);

    // Role check
    if (role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch with user details populated
    let student = await Student.findOne({ user: userId }).populate(
      "user",
      "name email"
    );

    if (!student) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Convert to plain JS object
    student = student.toObject();

    // Return structured response
    res.status(200).json({
      ...student,
      name: student.user?.name || "",
      email: student.user?.email || "",
      profileImage: student.profileImage || { url: "", public_id: "" },
      coverImage: student.coverImage || { url: "", public_id: "" },
    });
  } catch (error) {
    console.error("Get Student Profile Error:", error);
    res.status(500).json({ message: "Server error" });
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


async function handleStudentProfileDelete(req, res) {
  try {
    const id = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required to delete account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role.toLowerCase() !== "student") {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this account" });
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

    // Get student profile data
    const student = await Student.findOne({ user: userId }).populate("user", "name email");

    // Get post stats
    const Post = require("../model/Posts");
    const totalPosts = await Post.countDocuments({ user: userId });

    // Get total likes received across all posts
    const userPosts = await Post.find({ user: userId });
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);

    const stats = [
      { label: "Skills", value: student?.skills?.length || 0 },
      { label: "Projects", value: student?.projects?.length || 0 },
      { label: "Achievements", value: student?.achievements?.length || 0 },
      { label: "Posts Created", value: totalPosts },
    ];

    // Get recent posts as activity
    const recentPosts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const activities = recentPosts.map((post) => {
      const timeAgo = getTimeAgo(post.createdAt);
      return {
        type: "post",
        title: "Post",
        description: post.content?.substring(0, 80) + (post.content?.length > 80 ? "..." : ""),
        timestamp: timeAgo,
      };
    });

    // If no recent posts, show profile-based activity
    if (activities.length === 0 && student) {
      activities.push({
        type: "profile",
        title: "Profile Created",
        description: `Department: ${student.department || "Not set"}`,
        timestamp: getTimeAgo(student.createdAt),
      });
    }

    res.status(200).json({
      success: true,
      data: { stats, activities },
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Helper to convert dates to "X ago" format
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

module.exports = {
  handleUpdateStudentProfile,
  handleGetMyProfile,
  handleStudentProfileDelete,
  handleGetUserById,
  handleInsertDataToStudentModel,
  handleGetStudentProfile,
  handleGetDashboardData,
};
