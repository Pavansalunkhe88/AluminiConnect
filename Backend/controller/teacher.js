const User = require("../model/registerUser/UserScehma");
const bcrypt = require("bcrypt");
const Teacher = require("../model/Teacher");
const { handleAddRemoveArray } = require("../utils/profileDataArray");
const cloudinary = require("../utils/cloudinaryConfig");
const fs = require("fs");

async function handleDeleteTeacher(req, res) {
  const { id } = req.params;
  res.send(`Delete Teacher with ID: ${id}`);
}


async function handleInsertDataToTacherModel(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    console.log("BODY →", req.body);
    console.log("FILES →", req.files);

    if (role !== "Teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    let teacher = await Teacher.findOne({ user: userId });

    if (!teacher) {
      teacher = new Teacher({ user: userId });
    }

    // OWNERSHIP CHECK
    if (teacher.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // upload function
    const uploadToCloudinary = async (file, folder) => {
      const upload = await cloudinary.uploader.upload(file.path, {
        folder,
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
      });

      // delete temp file
      fs.unlinkSync(file.path);

      return {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    };

    // Handle profileImage upload
    if (req.files?.profileImage?.length > 0) {
      const file = req.files.profileImage[0];

      // delete old image if exists
      if (teacher.profileImage?.public_id) {
        await cloudinary.uploader.destroy(teacher.profileImage.public_id);
      }

      teacher.profileImage = await uploadToCloudinary(file, "teacher_profiles");
    }

    // Handle coverImage upload
    if (req.files?.coverImage?.length > 0) {
      const file = req.files.coverImage[0];

      // delete old image if exists
      if (teacher.coverImage?.public_id) {
        await cloudinary.uploader.destroy(teacher.coverImage.public_id);
      }

      teacher.coverImage = await uploadToCloudinary(file, "teacher_covers");
    }

    const allowed = [
      "designation",
      "contact",
      "department",
      "experienceYears",
      "achievements",
      "qualifications",
      "bio",
      "location",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        teacher[field] = req.body[field];
      }
    });

    // specialization array
    if (req.body.specialization) {
      teacher.specialization = handleAddRemoveArray(
        teacher.specialization || [],
        req.body.specialization
      );
    }

    await teacher.save();

    res.status(200).json({
      message: "Teacher profile updated successfully",
      profile: teacher,
    });
  } catch (err) {
    console.log("Error while Inserting the data :", err.message);
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

async function handleGetTeacherProfile(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role.toLowerCase();
    //console.log(userId);
    // const user = await User.findById({userId, user: userId})
    // .populate("user", "name email")

    if (role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const teacher = await Teacher.findOne({ user: userId }).populate(
      "user",
      "name email"
    );

    if (!teacher) {
      return res.status(404).json({ message: "Profile not found" });
    }

    //res.status(200).json(teacher);
    res.status(200).json({
      ...teacher.toObject(),
      name: teacher.user?.name,
      email: teacher.user?.email,
    });
  } catch (error) {
    console.error("Teacher Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function handleUpdateTeacherProfile(req, res) {
  try {
    const id = req.user?.id;
    if (!id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
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

    if (email) teacher.email = email;
    if (name) teacher.name = name;

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
      return res
        .status(400)
        .json({ message: "Password is required to delete account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role.toLowerCase() !== "teacher") {
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

    const Student = require("../model/Student");
    const Alumni = require("../model/Alumni");
    const Post = require("../model/Posts");

    // Get teacher profile
    const teacher = await Teacher.findOne({ user: userId }).populate("user", "name email");

    const department = teacher?.department || "";

    // Count students and alumni in same department
    const totalStudents = department ? await Student.countDocuments({ department }) : 0;
    const totalAlumni = department ? await Alumni.countDocuments({ department }) : 0;

    // Posts by this teacher
    const totalPosts = await Post.countDocuments({ user: userId });

    const stats = [
      { label: "Students in Dept", value: totalStudents },
      { label: "Alumni in Dept", value: totalAlumni },
      { label: "Experience (Yrs)", value: teacher?.experienceYears || 0 },
      { label: "Posts Created", value: totalPosts },
    ];

    // Recent posts as activity
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

    if (activities.length === 0 && teacher) {
      activities.push({
        type: "profile",
        title: "Profile Active",
        description: `Department: ${department || "Not set"}`,
        timestamp: getTimeAgo(teacher.createdAt),
      });
    }

    res.status(200).json({
      success: true,
      data: { stats, activities },
    });
  } catch (err) {
    console.error("Error fetching teacher dashboard data:", err);
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
  handleDeleteTeacher,
  //handleGetTeacherProfile,
  //handleGetTeacherProfileToUpdate,
  handleUpdateTeacherProfile,
  handleTeacherProfileDelete,
  handleInsertDataToTacherModel,
  handleGetTeacherProfile,
  handleGetDashboardData,
};

