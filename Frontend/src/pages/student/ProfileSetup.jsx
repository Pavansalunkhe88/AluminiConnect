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

const StudentProfileForm = () => {
  const [form, setForm] = useState({
    department: "",
    address: "",
    batch: "",
    course: "",
    contact: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Convert file to Base64
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
      const res = await fetch("/api/student/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert("Profile submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold mb-5 text-center">Complete Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        
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
              <option key={i} value={dept}>{dept}</option>
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
