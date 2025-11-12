import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import axios from "axios";

const StudentProfile = () => {
  const { user } = useAuth(); // Authenticated user
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch extended profile details from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students/${user?.studentId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.studentId) fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-2xl w-[90%] md:w-[60%] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-32 relative">
          <div className="absolute -bottom-10 left-10 flex items-center">
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold border-4 border-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="ml-4 text-white">
              <h2 className="text-xl font-semibold">{user?.name || "Unnamed Student"}</h2>
              <p className="text-sm">{profile?.batch ? `Class of ${profile.batch}` : "Batch not specified"}</p>
            </div>
          </div>

          <button className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium">
            Edit Profile
          </button>
        </div>

        {/* Main Info */}
        <div className="mt-14 px-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Email</h3>
              <p className="text-gray-800 font-medium">{user?.email || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">PRN Number</h3>
              <p className="text-gray-800 font-medium">{user?.prn_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Department</h3>
              <p className="text-gray-800 font-medium">{profile?.department || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Role</h3>
              <p className="text-gray-800 font-medium">{user?.role || "Student"}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Bio</h3>
              <p className="text-gray-800 font-medium">{profile?.bio || "No bio added yet."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around border-t py-5 bg-gray-50 w-[90%] md:w-[60%]">
        <div className="text-center">
          <p className="text-blue-600 font-bold text-lg">{profile?.connections || 0}</p>
          <p className="text-gray-600 text-sm">Connections</p>
        </div>
        <div className="text-center">
          <p className="text-green-600 font-bold text-lg">{profile?.posts || 0}</p>
          <p className="text-gray-600 text-sm">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-purple-600 font-bold text-lg">{profile?.profileViews || 0}</p>
          <p className="text-gray-600 text-sm">Profile Views</p>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-8 w-[90%] md:w-[60%] space-y-6">
        {/* Skills */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Skills</h3>
          {profile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No skills added yet.</p>
          )}
        </Card>

        {/* Projects */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Projects</h3>
          {profile?.projects?.length > 0 ? (
            <ul className="space-y-3">
              {profile.projects.map((proj, i) => (
                <li key={i}>
                  <p className="font-medium text-gray-900">{proj.title}</p>
                  <p className="text-gray-600 text-sm">{proj.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No projects added yet.</p>
          )}
        </Card>

        {/* Achievements */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Achievements</h3>
          {profile?.achievements?.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {profile.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No achievements added yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
