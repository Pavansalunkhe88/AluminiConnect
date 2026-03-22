import React, { useState } from "react";
import { motion } from "framer-motion";

const departments = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Electrical Engineering",
  "Artificial Intelligence and Data Science",
  "Instrumentation Engineering",
];

const skillOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Machine Learning",
  "Data Science",
  "Cloud Computing",
  "DevOps",
  "Cyber Security",
  "Full Stack Development",
  "Java",
  "C++",
];

const StudentProfileForm = () => {
  const [form, setForm] = useState({
    department: "",
    address: "",
    currentYear: "",
    projects: "",
    bio: "",
    skills: "",
    achievements: "",
    batch: "",
    course: "",
    contact: "",
  });

  //const [achievementInput, setAchievementInput] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSkill = (skill) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return {
          ...prev,
          skills: prev.skills.filter((s) => s !== skill),
        };
      }
      return {
        ...prev,
        skills: [...prev.skills, skill],
      };
    });
  };


  // Add Achievement
  // const addAchievement = () => {
  //   if (!achievementInput.trim()) return;
  //   setForm({
  //     ...form,
  //     achievements: [...form.achievements, achievementInput],
  //   });
  //   setAchievementInput("");
  // };


  const handleFileUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append simple text fields
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "profileImage" && key !== "coverImage") {
        formData.append(key, value);
      }
    });

    // Append files
    if (profileImage) formData.append("profileImage", profileImage);
    if (coverImage) formData.append("coverImage", coverImage);

    // Debug log
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await fetch("http://localhost:4000/api/student/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("SERVER:", data);

      if (!res.ok) {
        alert(data.message || "Failed to save profile");
        return;
      }

      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold mb-5 text-center">
        Complete Your Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Bio */}
        <div>
          <label className="font-medium">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Write anything special which defines you."
          />
        </div>

        {/* Current Year */}
        <div>
          <label className="font-medium">Current Year</label>
          <input
            name="currentYear"
            value={form.currentYear}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Which year currently you are in ?"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block font-medium mb-1">Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept, i) => (
              <option key={i} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter your address"
          />
        </div>

        {/* Batch */}
        <div>
          <label className="block font-medium mb-1">Batch</label>
          <input
            type="text"
            name="batch"
            value={form.batch}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="2022–2025"
            required
          />
        </div>

        {/* Projects */}
        {/* <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Achievements</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {profile?.achievements?.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div> */}

        {/* Course */}
        <div>
          <label className="block font-medium mb-1">Course</label>
          <input
            type="text"
            name="course"
            value={form.course}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="e.g., Diploma, B.Tech"
          />
        </div>
        

        {/* Contact */}
        <div>
          <label className="block font-medium mb-1">Contact Number</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter phone number"
          />
        </div>

        {/* Skills */}

        <div>
          <label className="font-medium">Skills</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {skillOptions.map((skill) => (
              <label key={skill} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.skills.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Achievements */}
        {/* <div>
          <label className="font-medium">Achievements</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              placeholder="Add an achievement"
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={addAchievement}
              className="px-4 bg-gray-700 text-white rounded-lg"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 list-disc pl-6">
            {form.achievements.map((ach, index) => (
              <li key={index}>{ach}</li>
            ))}
          </ul>
        </div> */}

        {/* Profile Image */}
        <div>
          <label className="block font-medium mb-1">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, setProfileImage)}
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block font-medium mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, setCoverImage)}
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
          whileTap={{ scale: 0.96 }}
        >
          {loading ? "Submitting..." : "Save Profile"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default StudentProfileForm;
