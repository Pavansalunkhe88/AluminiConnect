const Job = require("../model/Job");
const User = require("../model/registerUser/UserScehma");
const Student = require("../model/Student");
const Alumni = require("../model/Alumni");
const Teacher = require("../model/Teacher");
const { generateJobRecommendations } = require("../utils/ai.service");

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name role").sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new job
const createJob = async (req, res) => {
  try {
    const { title, company, location, description, skillsRequired, salary, jobType, applyLink } = req.body;
    const userRole = req.user.role;

    // Only allow specific roles
    if (!["Alumni", "Teacher", "Admin", "admin", "superadmin"].includes(userRole)) {
      return res.status(403).json({ success: false, message: "You are not authorized to post a job." });
    }

    if (!title || !company || !location || !description) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const newJob = new Job({
      title,
      company,
      location,
      description,
      skillsRequired: skillsRequired || [],
      salary,
      jobType,
      applyLink,
      postedBy: req.user.id,
    });

    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get AI Recommended Jobs
const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Fetch the detailed user profile to get their skills, department, etc.
    let profileData = null;
    if (userRole === "Student") {
      profileData = await Student.findOne({ user: userId });
    } else if (userRole === "Alumni") {
      profileData = await Alumni.findOne({ user: userId });
    } else if (userRole === "Teacher") {
      profileData = await Teacher.findOne({ user: userId });
    }

    if (!profileData) {
      return res.status(404).json({ success: false, message: "Profile not found for recommendations." });
    }

    const userProfile = {
      department: profileData.department || "",
      skills: profileData.skills || [],
      role: userRole
    };

    // Get all recent active jobs (limit to 50 for the AI prompt size)
    const jobsList = await Job.find().sort({ createdAt: -1 }).limit(50).lean();

    if (jobsList.length === 0) {
      return res.status(200).json({ success: true, recommendations: [] });
    }

    // Call the AI utility service
    const recommendations = await generateJobRecommendations(userProfile, jobsList);
    
    // Sort and enrich the job data corresponding to the AI's recommendations
    // Expecting AI to return an array of { jobId: "ID", reason: "reason text" }
    const recommendedJobs = recommendations.map(rec => {
      const jobMatch = jobsList.find(j => j._id.toString() === rec.jobId);
      return jobMatch ? { ...jobMatch, aiReason: rec.reason } : null;
    }).filter(j => j !== null);

    res.status(200).json({ success: true, recommendations: recommendedJobs });
  } catch (err) {
    console.error("Error fetching recommended jobs:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllJobs,
  createJob,
  getRecommendedJobs,
};
