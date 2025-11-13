import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AlumniProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------- Dummy Alumni Data (Fallback) --------
  const dummyAlumni = {
    name: "Rahul Patil",
    email: "rahulpatil@gsmcoe.edu.in",
    role: "alumni",
    profileImage: "",
    graduationYear: 2022,
    department: "Computer Engineering",
    college: "Genba Sopanrao Moze College, Balewadi",
    company: "Infosys Technologies",
    position: "Software Engineer",
    bio: "Driven alumni working in cloud and backend engineering.",
    skills: ["React", "Node.js", "AWS", "Python", "MongoDB"],
    achievements: [
      "Top Performer Award - Infosys (2023)",
      "Hackathon Winner - GSMCOE (2022)"
    ],
    contributions: [
      "Conducted seminar on Cloud Computing",
      "Mentored Junior Students for Hackathons"
    ],
  };

  // ---------- BACKEND FETCH ----------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/alumni/${user?.alumniId}`
        );

        // If backend returns valid data
        if (res.data && res.data.name) {
          setProfile(res.data);
        } else {
          setProfile(dummyAlumni);
        }
      } catch (err) {
        console.error("Backend offline → using dummy alumni:", err);
        setProfile(dummyAlumni);
      } finally {
        setLoading(false);
      }
    };

    if (user?.alumniId) fetchProfile();
    else {
      // If user has no alumniId in auth, load dummy
      setProfile(dummyAlumni);
      setLoading(false);
    }
  }, [user]);

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading profile...
      </div>
    );
  }

  // ---------- UI START ----------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-md rounded-2xl w-[90%] md:w-[60%] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-32 relative">
          <div className="absolute -bottom-10 left-10 flex items-center">

            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Alumni"
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center 
                text-2xl font-bold border-4 border-white">
                {profile.name.charAt(0)}
              </div>
            )}

            <div className="ml-4 text-white">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm">
                {profile.graduationYear ? `Batch of ${profile.graduationYear}` : "Graduate"}
              </p>
              <p className="text-sm">{profile.college}</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/alumni/profile-setup')}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
          >
            Edit Profile
          </button>

        </div>

        {/* Main Info */}
        <div className="mt-14 px-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Email</h3>
              <p className="text-gray-800 font-medium">{profile.email}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Department</h3>
              <p className="text-gray-800 font-medium">{profile.department}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Current Company</h3>
              <p className="text-gray-800 font-medium">{profile.company}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Position</h3>
              <p className="text-gray-800 font-medium">{profile.position}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Bio</h3>
              <p className="text-gray-800 font-medium">{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Sections */}
      <div className="mt-8 w-[90%] md:w-[60%] space-y-6">

        {/* Skills */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Achievements</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {profile.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Card>

        {/* Contributions */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Alumni Contributions</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {profile.contributions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Card>

      </div>
    </div>
  );
};

export default AlumniProfile;
