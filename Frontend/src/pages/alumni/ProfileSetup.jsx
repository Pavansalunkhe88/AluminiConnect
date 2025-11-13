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

const AlumniProfileForm = () => {
  const [form, setForm] = useState({
    graduationYear: "",
    department: "",
    currentCompany: "",
    currentPosition: "",
    linkedin: "",
    contact: "",
    skills: [],
    achievements: [],
    location: "",
  });

  const [achievementInput, setAchievementInput] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add/Remove Skills
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
  const addAchievement = () => {
    if (!achievementInput.trim()) return;
    setForm({
      ...form,
      achievements: [...form.achievements, achievementInput],
    });
    setAchievementInput("");
  };

  // Convert image file → Base64
  const handleFileUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImage(reader.result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      profileImage,
      coverImage,
    };

    try {
      const res = await fetch("/api/alumni/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert("Alumni Profile Saved Successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white shadow-lg p-6 mt-10 rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">Alumni Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Graduation Year */}
        <div>
          <label className="font-medium">Graduation Year</label>
          <input
            type="text"
            name="graduationYear"
            value={form.graduationYear}
            onChange={handleChange}
            placeholder="e.g., 2022"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="font-medium">Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Current Company */}
        <div>
          <label className="font-medium">Current Company</label>
          <input
            type="text"
            name="currentCompany"
            value={form.currentCompany}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Position */}
        <div>
          <label className="font-medium">Current Position</label>
          <input
            type="text"
            name="currentPosition"
            value={form.currentPosition}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="font-medium">LinkedIn URL</label>
          <input
            type="text"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="font-medium">Contact Number</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
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
        <div>
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
        </div>

        {/* Location */}
        <div>
          <label className="font-medium">Current Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Images */}
        <div>
          <label className="font-medium">Profile Image</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setProfileImage)} />
        </div>

        <div>
          <label className="font-medium">Cover Image</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setCoverImage)} />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save Profile"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AlumniProfileForm;
