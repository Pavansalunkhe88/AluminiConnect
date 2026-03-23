const Student = require("../../model/Student");
const Alumni = require("../../model/Alumni");
const Teacher = require("../../model/Teacher");
const { generateRecommendations } = require("../../utils/ai.service");

// Helper to deduce role from collections
const determineRoleFromModel = async (userId) => {
  let user = await Student.findOne({ user: userId }).lean();
  if (user) return { ...user, role: "student", _id: user.user }; // use primary user ID to match frontend expectation
  
  user = await Alumni.findOne({ user: userId }).lean();
  if (user) return { ...user, role: "alumni", _id: user.user };
  
  user = await Teacher.findOne({ user: userId }).lean();
  if (user) return { ...user, role: "teacher", _id: user.user };
  
  return null;
};

// Main controller endpoint
const getRecommendedUsers = async (req, res) => {
  try {
    const requestingUserId = req.user.id;
    
    // 1. Fetch current user profile context
    const currentUserProfile = await determineRoleFromModel(requestingUserId);
    if (!currentUserProfile) {
      // Return gracefully instead of 404 to prevent Axios UI console errors for incomplete profiles
      return res.status(200).json({ success: true, recommendations: [] });
    }

    // 2. Fetch potentials/candidates (Limit to 30 to save AI prompt tokens)
    // For a real app, you might query MongoDB directly for overlapping departments first instead of random batches
    const [students, alumni, teachers] = await Promise.all([
      Student.find({ verified: true, user: { $ne: requestingUserId } }).populate('user', 'name profileImage').limit(15).lean(),
      Alumni.find({ verified: true, user: { $ne: requestingUserId } }).populate('user', 'name profileImage').limit(15).lean(),
      Teacher.find({ verified: true, user: { $ne: requestingUserId } }).populate('user', 'name profileImage').limit(5).lean(),
    ]);

    const candidatesPool = [
      ...students.map(s => ({ ...s, role: "student", _id: s.user?._id?.toString(), name: s.user?.name, image: s.user?.profileImage?.url || s.profileImage?.url })),
      ...alumni.map(a => ({ ...a, role: "alumni", _id: a.user?._id?.toString(), name: a.user?.name, image: a.user?.profileImage?.url || a.profileImage?.url })),
      ...teachers.map(t => ({ ...t, role: "teacher", _id: t.user?._id?.toString(), name: t.user?.name, image: t.user?.profileImage?.url || t.profileImage?.url }))
    ].filter(c => c._id); // Filter out ghosts

    if (candidatesPool.length === 0) {
      return res.status(200).json({ success: true, recommendations: [] });
    }

    // 3. Process candidates against AI Model
    const AI_Results = await generateRecommendations(currentUserProfile, candidatesPool);

    // 4. Hydrate AI results with UI data
    const enrichedRecommendations = AI_Results.map(rec => {
      const fullProfile = candidatesPool.find(c => c._id === rec.userId);
      if (!fullProfile) return null;
      
      return {
        _id: fullProfile._id,
        name: fullProfile.name,
        role: fullProfile.role,
        department: fullProfile.department,
        image: fullProfile.image,
        reason: rec.reason
      };
    }).filter(Boolean); // Clean any nulls that the AI messed up ID matches for

    res.status(200).json({ success: true, recommendations: enrichedRecommendations });
    
  } catch (error) {
    console.error("Controller Error (Recommendations):", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getRecommendedUsers
};
