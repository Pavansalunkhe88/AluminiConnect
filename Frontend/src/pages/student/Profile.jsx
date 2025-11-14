import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentProfileForm from "./ProfileSetup";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // ---- DUMMY DATA (fallback only) ----
  const dummyProfile = {
    name: "Pavan Salunkhe",
    email: "pavan@example.com",
    batch: "2025",
    role: "student",
    profileImage: "",
    currentPosition: "Full Stack Developer",
    location: "Pune, India",
    bio: "Passionate MERN Developer || AWS & React",
    connections: 120,
    posts: 12,
    profileViews: 3500,
    skills: ["React", "Node.js", "MongoDB", "AWS", "Tailwind"],
    projects: [
      { title: "KarmBhoomi", description: "Hyperlocal volunteering platform" },
      { title: "Portfolio", description: "My personal React portfolio" },
    ],
    achievements: ["Winner - Hackathon 2024", "Completed MERN Internship"],
  };

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:4000/api/student/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.error("Backend offline → using dummy student profile.", err);
        setProfile(dummyProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  //Conditional Rendering
  if (editing) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="flex justify-center">
          <button
            onClick={() => setEditing(false)}
            className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Profile
          </button>
        </div>
        <StudentProfileForm /> {/* Render the form here */}
      </div>
    );
  }

  // Even fallback always ensures profile exists
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-2xl w-[90%] md:w-[60%] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-32 relative">
          
          {profile?.coverImage?.url && (
            <img
              src={profile.coverImage.url}
              className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
              alt="Cover"
            />
          )}

          <div className="absolute -bottom-10 left-10 flex items-center">
            {profile?.profileImage?.url? (
              <img
                src={profile.profileImage.url}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold border-4 border-white">
                {profile?.name?.charAt(0)}
              </div>
            )}

            <div className="ml-4 text-white">
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              <p className="text-sm">
                {profile.batch ? `Class of ${profile?.batch}` : ""}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
          >
            Edit Profile
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-14 px-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">
                Email
              </h3>
              <p className="text-gray-800 font-medium">{profile?.email}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">
                Current Year
              </h3>
              <p className="text-gray-800 font-medium">
                {profile?.currentYear}
              </p>
            </div>

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">
                Location
              </h3>
              <p className="text-gray-800 font-medium">{profile?.address}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-gray-500 text-xs font-semibold uppercase">
                Bio
              </h3>
              <p className="text-gray-800 font-medium">{profile?.bio}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around border-t py-5 bg-gray-50">
          <div className="text-center">
            <p className="text-blue-600 font-bold text-lg">
              {profile?.connections || 0}
            </p>
            <p className="text-gray-600 text-sm">Connections</p>
          </div>
          <div className="text-center">
            <p className="text-green-600 font-bold text-lg">{profile?.posts || 0}</p>
            <p className="text-gray-600 text-sm">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-purple-600 font-bold text-lg">
              {profile?.profileViews || 0}
            </p>
            <p className="text-gray-600 text-sm">Profile Views</p>
          </div>
        </div>
      </div>

      {/* Extra Sections */}
      <div className="mt-8 w-[90%] md:w-[60%] space-y-6">
        {/* Skills */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((s, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Projects</h3>

          <ul className="space-y-3">
            {profile?.projects?.map((p, i) => (
              <li key={i}>
                <p className="font-medium text-gray-900">{p?.title}</p>
                <p className="text-gray-600 text-sm">{p?.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Achievements */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Achievements
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {profile?.achievements?.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
