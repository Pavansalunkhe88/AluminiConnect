const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini - API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key");

/**
 * Generate match recommendations using Gemini AI
 */
const generateRecommendations = async (currentUser, candidates) => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not defined. Falling back to algorithmic matching.");
    return fallbackAlgorithmicMatch(currentUser, candidates);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format data securely to avoid leaking sensitive information to AI
    const prompt = `
    You are an AI matchmaking assistant for a university alumni portal.
    Analyze the "currentUser" and recommend the best 5 users to connect with from the "candidates" list.
    Base your logic on shared departments, same skills, and overlapping interests.
    
    CRITICAL INSTRUCTION: Return ONLY a valid JSON array of objects. Do not wrap it in markdown blockquotes like \`\`\`json.
    Format exactly like this strictly valid JSON:
    [
      { "userId": "candidate_id_here", "reason": "Brief 1-sentence explanation of why they match well" }
    ]
    
    Current User Profile:
    ${JSON.stringify({ 
      department: currentUser.department, 
      skills: currentUser.skills, 
      batch: currentUser.batch,
      role: currentUser.role 
    })}
    
    Candidate Pool:
    ${JSON.stringify(candidates.map(c => ({ 
      userId: c._id, 
      department: c.department, 
      skills: c.skills, 
      batch: c.batch,
      role: c.role 
    })))}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON safely by attempting to clean any unexpected markdown
    const cleanJson = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
    return JSON.parse(cleanJson);
    
  } catch (error) {
    console.error("AI Recommendation Error:", error.message);
    return fallbackAlgorithmicMatch(currentUser, candidates);
  }
};

/**
 * Basic algorithmic fallback if AI model fails or key is missing
 */
const fallbackAlgorithmicMatch = (currentUser, candidates) => {
  return candidates
    .filter(u => u._id.toString() !== currentUser._id.toString())
    .map(u => {
      let score = 0;
      let reason = "An interesting profile connecting to your network.";
      
      if (u.department === currentUser.department) {
        score += 5;
        reason = "Shares the same department.";
      }
      
      if (u.role === "alumni" && currentUser.role === "student") {
        score += 3;
        reason = "A great alumni connection from your department.";
      }

      // Check intersecting skills if available
      const sharedSkills = (u.skills || []).filter(s => (currentUser.skills || []).includes(s));
      if (sharedSkills.length > 0) {
        score += sharedSkills.length * 2;
        reason = `You both share interests in ${sharedSkills.join(', ')}.`;
      }

      return { userId: u._id.toString(), score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(u => ({ userId: u.userId, reason: u.reason }));
};

const generateJobRecommendations = async (userProfile, jobsList) => {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackJobMatch(userProfile, jobsList);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = \`
    You are an AI career matchmaking assistant for a university alumni portal.
    Analyze the "userProfile" and recommend the best matching jobs from the "jobsList".
    Return the top 5 most relevant jobs based on the user's skills and department.
    
    CRITICAL INSTRUCTION: Return ONLY a valid JSON array of objects. Do not wrap it in markdown blockquotes like \\\`\\\`\\\`json.
    Format exactly like this strictly valid JSON:
    [
      { "jobId": "job_id_here", "reason": "Brief 1-sentence explanation of why it fits the user" }
    ]
    
    User Profile:
    \${JSON.stringify(userProfile)}
    
    Jobs List:
    \${JSON.stringify(jobsList.map(j => ({ 
      jobId: j._id, 
      title: j.title, 
      company: j.company, 
      skillsRequired: j.skillsRequired, 
      description: j.description.substring(0, 100) 
    })))}
    \`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/\`\`\`json/gi, "").replace(/\`\`\`/gi, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Job Recommendation Error:", error.message);
    return fallbackJobMatch(userProfile, jobsList);
  }
};

const fallbackJobMatch = (userProfile, jobsList) => {
  return jobsList
    .map(j => {
      let score = 0;
      let reason = "An interesting job opportunity.";
      
      const userSkills = (userProfile.skills || []).map(s => s.toLowerCase());
      const requiredSkills = (j.skillsRequired || []).map(s => s.toLowerCase());
      
      const sharedSkills = requiredSkills.filter(s => userSkills.includes(s));
      if (sharedSkills.length > 0) {
        score += sharedSkills.length * 2;
        reason = \`Matches your skills in \${sharedSkills.join(', ')}.\`;
      }
      
      return { jobId: j._id.toString(), score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(j => ({ jobId: j.jobId, reason: j.reason }));
};

module.exports = { generateRecommendations, generateJobRecommendations };

