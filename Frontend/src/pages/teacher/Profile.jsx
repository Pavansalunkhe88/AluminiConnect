import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import axios from "axios";

const TeacherProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------- DUMMY TEACHER PROFILE (fallback) ----------
  const dummyTeacher = {
    name: "Swati Gaikwad",
    role: "teacher",
    email: "swati.gaikwad@gsmcoe.edu.in",
    department: "Computer Engineering",
    emp_id: "TCH-001",
    designation: "Assistant Professor",
    experience: 6,
    college: "Genba Sopanrao Moze College, Balewadi",
    profileImage: "",
    bio: "Dedicated educator passionate about teaching Data Structures and Python.",
    subjects: ["Data Structures", "Python Programming", "Software Engineering"],
    publications: [
      "Research Paper on AI-based Student Analytics (2023)",
      "Deep Learning Approaches in Education (2022)"
    ],
    achievements: [
      "Best Faculty Award 2023",
      "NPTEL Gold Certificate in Python"
    ],
    skills: ["Python", "Machine Learning", "C++", "DBMS", "Teaching"],
  };

  // ---------- FETCH TEACHER FROM BACKEND ----------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/teachers/${user?.emp_id}`
        );

        // If backend returns valid data → use it
        if (res.data && res.data.name) {
          setProfile(res.data);
        } else {
          setProfile(dummyTeacher);
        }
      } catch (err) {
        console.error("Backend offline → using dummy teacher profile.", err);
        setProfile(dummyTeacher);
      } finally {
        setLoading(false);
      }
    };

    if (user?.emp_id) fetchProfile();
    else {
      // If no auth teacher found → fallback
      setProfile(dummyTeacher);
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

  // ---------- UI RENDER START ----------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-md rounded-2xl w-[90%] md:w-[60%] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-32 relative">
          <div className="absolute -bottom-10 left-10 flex items-center">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Teacher"
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold border-4 border-white">
                {profile.name.charAt(0)}
              </div>
            )}

            <div className="ml-4 text-white">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm">{profile.designation}</p>
              <p className="text-sm">{profile.college}</p>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="mt-14 px-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Email</h3>
              <p className="text-gray-800 font-medium">{profile.email}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Employee ID</h3>
              <p className="text-gray-800 font-medium">{profile.emp_id}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Department</h3>
              <p className="text-gray-800 font-medium">{profile.department}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Experience</h3>
              <p className="text-gray-800 font-medium">{profile.experience} Years</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Bio</h3>
              <p className="text-gray-800 font-medium">{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-8 w-[90%] md:w-[60%] space-y-6">

        {/* Subjects */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Subjects Taught</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {profile.subjects.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>

        {/* Publications */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Publications</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {profile.publications.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </Card>

        {/* Skills */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
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

      </div>
    </div>
  );
};

export default TeacherProfile;
