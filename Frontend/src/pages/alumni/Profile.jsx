import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import axios from "axios";

const AlumniProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/alumni/${user?.alumniId}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching alumni profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.alumniId) fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
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
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
            <div className="ml-4 text-white">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm">{profile?.graduationYear ? `Batch of ${profile.graduationYear}` : "Graduate"}</p>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="mt-14 px-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Email</h3>
              <p className="text-gray-800 font-medium">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Department</h3>
              <p className="text-gray-800 font-medium">{profile?.department || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Current Company</h3>
              <p className="text-gray-800 font-medium">{profile?.company || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Position</h3>
              <p className="text-gray-800 font-medium">{profile?.position || "N/A"}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Bio</h3>
              <p className="text-gray-800 font-medium">{profile?.bio || "No bio added yet."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-8 w-[90%] md:w-[60%] space-y-6">
        {/* Skills */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Skills</h3>
          {profile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No skills added.</p>
          )}
        </Card>

        {/* Achievements */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Achievements</h3>
          {profile?.achievements?.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {profile.achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No achievements recorded.</p>
          )}
        </Card>

        {/* Contributions */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Alumni Contributions</h3>
          {profile?.contributions?.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {profile.contributions.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No contributions yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AlumniProfile;
