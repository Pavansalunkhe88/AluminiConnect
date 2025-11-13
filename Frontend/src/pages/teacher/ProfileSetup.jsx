import React, { useState } from "react";
import { motion } from "framer-motion";

const departments = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Artificial Intelligence and Data Science",
  "Instrumentation Engineering",
];

const specializations = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Web Development",
  "Cyber Security",
  "Embedded Systems",
  "IoT",
  "Blockchain",
  "Software Engineering",
  "Database Management",
  "Data Structure & Algorithm",
];

const TeacherProfileForm = () => {
  const [form, setForm] = useState({
    designation: "",
    contact: "",
    department: "",
    specialization: [],
    experienceYears: "",
    qualifications: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Multi-select specialization
  const handleSpecialization = (value) => {
    setForm((prev) => {
      const exists = prev.specialization.includes(value);
      if (exists) {
        return {
          ...prev,
          specialization: prev.specialization.filter((sp) => sp !== value),
        };
      }
      return {
        ...prev,
        specialization: [...prev.specialization, value],
      };
    });
  };

  // Convert image to base64
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
      const res = await fetch("/api/teacher/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert("Teacher profile submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white p-6 mt-10 shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Teacher Profile Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Designation */}
        <div>
          <label className="font-medium">Designation</label>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Assistant Professor"
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
            placeholder="Enter contact number"
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

        {/* Specialization */}
        <div>
          <label className="font-medium">Specialization</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {specializations.map((sp) => (
              <label key={sp} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.specialization.includes(sp)}
                  onChange={() => handleSpecialization(sp)}
                />
                <span>{sp}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="font-medium">Experience (Years)</label>
          <input
            type="number"
            name="experienceYears"
            value={form.experienceYears}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., 5"
          />
        </div>

        {/* Qualifications */}
        <div>
          <label className="font-medium">Qualifications</label>
          <textarea
            name="qualifications"
            value={form.qualifications}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="M.Tech, PhD etc."
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="font-medium">Profile Image</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, setProfileImage)}
            accept="image/*"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="font-medium">Cover Image</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, setCoverImage)}
            accept="image/*"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save Profile"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TeacherProfileForm;
