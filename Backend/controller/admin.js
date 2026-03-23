const User = require("../model/registerUser/UserScehma");
const Student = require("../model/Student");
const Teacher = require("../model/Teacher");
const Alumni = require("../model/Alumni");
const Post = require("../model/Posts");
const Connection = require("../modules/connections/connectionSchema");
const PreApprovedUser = require("../model/PreApprovedUser");
const bcrypt = require("bcryptjs");
const csv = require("csv-parser");
const { Readable } = require("stream");

/* ═══════════════════════════════════════════════════════
   1. DASHBOARD & ANALYTICS
═══════════════════════════════════════════════════════ */
async function getDashboardStats(req, res) {
  try {
    const [
      totalStudents,
      totalAlumni,
      totalTeachers,
      verifiedStudents,
      verifiedTeachers,
      verifiedAlumni,
      totalPosts,
      totalConnections,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: "Student" }),
      User.countDocuments({ role: "Alumni" }),
      User.countDocuments({ role: "Teacher" }),
      Student.countDocuments({ verified: true }),
      Teacher.countDocuments({ verified: true }),
      Alumni.countDocuments({ verified: true }),
      Post.countDocuments(),
      Connection.countDocuments({ status: "ACCEPTED" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name role email createdAt"),
    ]);

    const totalUsers = totalStudents + totalAlumni + totalTeachers;
    const totalVerified = verifiedStudents + verifiedTeachers + verifiedAlumni;

    res.status(200).json({
      stats: {
        totalStudents,
        totalAlumni,
        totalTeachers,
        totalUsers,
        totalVerified,
        totalPosts,
        totalConnections,
        verificationRate: totalUsers > 0 ? Math.round((totalVerified / totalUsers) * 100) : 0,
      },
      recentUsers,
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   2. USER DATABASE MANAGEMENT
═══════════════════════════════════════════════════════ */
async function handleGetAllUsers(req, res) {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { prn_number: { $regex: search, $options: "i" } },
        { emp_id: { $regex: search, $options: "i" } },
      ];
    }

    // Exclude admins from list
    if (!role) filter.role = { $ne: "Admin" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    // Enrich with profile data (verified status)
    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const userData = u.toObject();
        let profile = null;
        if (u.role === "Student") profile = await Student.findOne({ user: u._id }).select("verified isActive department batch");
        else if (u.role === "Teacher") profile = await Teacher.findOne({ user: u._id }).select("verified isActive department designation");
        else if (u.role === "Alumni") profile = await Alumni.findOne({ user: u._id }).select("verified isActive department graduationYear currentCompany");
        
        return {
          ...userData,
          verified: profile?.verified ?? false,
          isActive: profile?.isActive ?? true,
          department: profile?.department || "N/A",
          extra: profile ? profile.toObject() : {},
        };
      })
    );

    // Counts by role
    const counts = {
      students: await User.countDocuments({ role: "Student" }),
      teachers: await User.countDocuments({ role: "Teacher" }),
      alumni: await User.countDocuments({ role: "Alumni" }),
    };

    res.status(200).json({
      users: enrichedUsers,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      counts,
    });
  } catch (err) {
    console.error("handleGetAllUsers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete associated profile
    if (user.role === "Student") await Student.findOneAndDelete({ user: id });
    else if (user.role === "Teacher") await Teacher.findOneAndDelete({ user: id });
    else if (user.role === "Alumni") await Alumni.findOneAndDelete({ user: id });

    // Delete user's posts
    await Post.deleteMany({ user: id });
    // Delete connections
    await Connection.deleteMany({ $or: [{ requesterId: id }, { recipientId: id }] });
    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User and associated data deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   3. USER VERIFICATION
═══════════════════════════════════════════════════════ */

async function verifyUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let updated;
    if (user.role === "Student") updated = await Student.findOneAndUpdate({ user: id }, { verified: true }, { new: true });
    else if (user.role === "Teacher") updated = await Teacher.findOneAndUpdate({ user: id }, { verified: true }, { new: true });
    else if (user.role === "Alumni") updated = await Alumni.findOneAndUpdate({ user: id }, { verified: true }, { new: true });

    if (!updated) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ message: `${user.role} verified successfully` });
  } catch (err) {
    console.error("verifyUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function rejectUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let updated;
    if (user.role === "Student") updated = await Student.findOneAndUpdate({ user: id }, { isActive: false, verified: false }, { new: true });
    else if (user.role === "Teacher") updated = await Teacher.findOneAndUpdate({ user: id }, { isActive: false, verified: false }, { new: true });
    else if (user.role === "Alumni") updated = await Alumni.findOneAndUpdate({ user: id }, { isActive: false, verified: false }, { new: true });

    if (!updated) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ message: `${user.role} rejected/deactivated` });
  } catch (err) {
    console.error("rejectUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   4. TEACHER VERIFICATION
═══════════════════════════════════════════════════════ */
async function getPendingTeachers(req, res) {
  try {
    const pendingProfiles = await Teacher.find({ verified: false, isActive: true }).populate({
      path: "user",
      select: "name email emp_id createdAt",
    });

    const teachers = pendingProfiles
      .filter((t) => t.user)
      .map((t) => ({
        _id: t.user._id,
        profileId: t._id,
        name: t.user.name,
        email: t.user.email,
        empId: t.user.emp_id,
        department: t.department,
        designation: t.designation,
        registeredAt: t.user.createdAt,
      }));

    const counts = {
      pending: await Teacher.countDocuments({ verified: false, isActive: true }),
      verified: await Teacher.countDocuments({ verified: true }),
      rejected: await Teacher.countDocuments({ isActive: false }),
    };

    res.status(200).json({ teachers, counts });
  } catch (err) {
    console.error("getPendingTeachers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   5. ALUMNI CREATION
═══════════════════════════════════════════════════════ */
async function createAlumniAccount(req, res) {
  try {
    const { name, email, prn, graduationYear, department } = req.body;

    if (!name || !email || !prn || !graduationYear || !department) {
      return res.status(400).json({ message: "All fields are required: name, email, prn, graduationYear, department" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "A user with this email already exists" });

    // Generate temp password
    const tempPassword = `Alumni@${Math.random().toString(36).slice(-6)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create User
    const user = await User.create({
      role: "Alumni",
      name,
      email: email.toLowerCase(),
      prn_number: prn,
      password: hashedPassword,
    });

    // Create Alumni profile
    await Alumni.create({
      user: user._id,
      graduationYear: parseInt(graduationYear),
      department,
      verified: true,
    });

    res.status(201).json({
      message: "Alumni account created successfully",
      user: { name, email, tempPassword },
    });
  } catch (err) {
    console.error("createAlumniAccount error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   6. ROLE UPDATE (student → alumni)
═══════════════════════════════════════════════════════ */
async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    if (!["Student", "Alumni", "Teacher"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: `Role updated to ${newRole}` });
  } catch (err) {
    console.error("updateUserRole error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   7. PLATFORM MONITORING
═══════════════════════════════════════════════════════ */
async function getMonitoringData(req, res) {
  try {
    // Recent activity from posts, connections
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("authorName role content createdAt")
      .lean();

    const recentConnections = await Connection.find({ status: "ACCEPTED" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("requesterId", "name role")
      .populate("recipientId", "name role")
      .lean();

    const usersByRole = {
      students: await User.countDocuments({ role: "Student" }),
      alumni: await User.countDocuments({ role: "Alumni" }),
      teachers: await User.countDocuments({ role: "Teacher" }),
    };

    const totalUsers = usersByRole.students + usersByRole.alumni + usersByRole.teachers;

    // Build activity stream
    const activities = [];

    recentPosts.forEach((p) => {
      activities.push({
        type: "post",
        text: `${p.authorName} (${p.role}) posted: "${p.content.substring(0, 60)}${p.content.length > 60 ? "..." : ""}"`,
        time: p.createdAt,
      });
    });

    recentConnections.forEach((c) => {
      if (c.requesterId && c.recipientId) {
        activities.push({
          type: "connection",
          text: `${c.requesterId.name} (${c.requesterId.role}) connected with ${c.recipientId.name} (${c.recipientId.role})`,
          time: c.updatedAt,
        });
      }
    });

    // Sort by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      liveUserCount: totalUsers,
      usersByRole,
      activities: activities.slice(0, 15),
    });
  } catch (err) {
    console.error("getMonitoringData error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   8. SECURITY & CONTROL
═══════════════════════════════════════════════════════ */
async function searchUsersForSecurity(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.status(200).json({ users: [] });

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { prn_number: { $regex: q, $options: "i" } },
        { emp_id: { $regex: q, $options: "i" } },
      ],
      role: { $ne: "Admin" },
    })
      .select("name email role prn_number emp_id")
      .limit(10);

    // Enrich with profile status
    const enriched = await Promise.all(
      users.map(async (u) => {
        const userData = u.toObject();
        let profile = null;
        if (u.role === "Student") profile = await Student.findOne({ user: u._id }).select("verified isActive");
        else if (u.role === "Teacher") profile = await Teacher.findOne({ user: u._id }).select("verified isActive");
        else if (u.role === "Alumni") profile = await Alumni.findOne({ user: u._id }).select("verified isActive");
        return { ...userData, verified: profile?.verified ?? false, isActive: profile?.isActive ?? true };
      })
    );

    res.status(200).json({ users: enriched });
  } catch (err) {
    console.error("searchUsersForSecurity error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function suspendUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "Student") await Student.findOneAndUpdate({ user: id }, { isActive: false });
    else if (user.role === "Teacher") await Teacher.findOneAndUpdate({ user: id }, { isActive: false });
    else if (user.role === "Alumni") await Alumni.findOneAndUpdate({ user: id }, { isActive: false });

    res.status(200).json({ message: "User suspended successfully" });
  } catch (err) {
    console.error("suspendUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function unsuspendUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "Student") await Student.findOneAndUpdate({ user: id }, { isActive: true });
    else if (user.role === "Teacher") await Teacher.findOneAndUpdate({ user: id }, { isActive: true });
    else if (user.role === "Alumni") await Alumni.findOneAndUpdate({ user: id }, { isActive: true });

    res.status(200).json({ message: "User unsuspended successfully" });
  } catch (err) {
    console.error("unsuspendUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getSecurityStats(req, res) {
  try {
    const suspended = await Promise.all([
      Student.countDocuments({ isActive: false }),
      Teacher.countDocuments({ isActive: false }),
      Alumni.countDocuments({ isActive: false }),
    ]);

    res.status(200).json({
      suspendedCount: suspended.reduce((a, b) => a + b, 0),
      totalUsers: await User.countDocuments({ role: { $ne: "Admin" } }),
    });
  } catch (err) {
    console.error("getSecurityStats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   9. DATA EXPORT
═══════════════════════════════════════════════════════ */
async function exportUsers(req, res) {
  try {
    const { type } = req.query; // students, teachers, alumni, all

    let users;
    if (type === "students") {
      users = await User.find({ role: "Student" }).select("-password -__v").lean();
    } else if (type === "teachers") {
      users = await User.find({ role: "Teacher" }).select("-password -__v").lean();
    } else if (type === "alumni") {
      users = await User.find({ role: "Alumni" }).select("-password -__v").lean();
    } else {
      users = await User.find({ role: { $ne: "Admin" } }).select("-password -__v").lean();
    }

    // Enrich with profile data
    const enriched = await Promise.all(
      users.map(async (u) => {
        let profile = null;
        if (u.role === "Student") profile = await Student.findOne({ user: u._id }).select("-__v").lean();
        else if (u.role === "Teacher") profile = await Teacher.findOne({ user: u._id }).select("-__v").lean();
        else if (u.role === "Alumni") profile = await Alumni.findOne({ user: u._id }).select("-__v").lean();
        return { ...u, profile };
      })
    );

    // Convert to CSV
    if (enriched.length === 0) {
      return res.status(200).json({ csv: "No data found", users: [] });
    }

    const headers = ["Name", "Email", "Role", "PRN/EmpID", "Department", "Verified", "Active", "Registered"];
    const rows = enriched.map((u) => [
      u.name,
      u.email,
      u.role,
      u.prn_number || u.emp_id || "N/A",
      u.profile?.department || "N/A",
      u.profile?.verified ? "Yes" : "No",
      u.profile?.isActive !== false ? "Yes" : "No",
      new Date(u.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${type || "all"}_users_${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (err) {
    console.error("exportUsers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* ═══════════════════════════════════════════════════════
   10. DATA IMPORT
═══════════════════════════════════════════════════════ */
async function importUsersCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        let importedCount = 0;
        let errorCount = 0;

        for (const row of results) {
          const { role, prn_number, employe_id, emp_id, name, email } = row;
          if (!role || !name || !email) {
            errorCount++;
            continue;
          }

          const resolvedEmpId = employe_id || emp_id;

          try {
            await PreApprovedUser.findOneAndUpdate(
              { email: email.toLowerCase() },
              {
                role: role.toLowerCase(),
                prn_number: prn_number || null,
                emp_id: resolvedEmpId || null,
                name,
                email: email.toLowerCase(),
              },
              { upsert: true, new: true }
            );
            importedCount++;
          } catch (upsertError) {
            console.error("Error upserting row:", row, upsertError);
            errorCount++;
          }
        }

        res.status(200).json({
          message: "CSV imported successfully",
          imported: importedCount,
          errors: errorCount,
        });
      })
      .on("error", (error) => {
        console.error("CSV parse error:", error);
        res.status(500).json({ message: "Error parsing CSV file", error: error.message });
      });
  } catch (err) {
    console.error("importUsersCSV error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  getDashboardStats,
  handleGetAllUsers,
  deleteUser,
  verifyUser,
  rejectUser,
  getPendingTeachers,
  createAlumniAccount,
  updateUserRole,
  getMonitoringData,
  searchUsersForSecurity,
  suspendUser,
  unsuspendUser,
  getSecurityStats,
  exportUsers,
  importUsersCSV,
};

