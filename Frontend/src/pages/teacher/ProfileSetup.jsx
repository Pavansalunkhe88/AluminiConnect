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
    profileImage: "",
    coverImage: "",
    achievements: "",
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
  // const handleFileUpload = (e, setImage) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => setImage(reader.result);
  // };

  const handleFileUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const payload = {
  //     ...form,
  //     profileImage,
  //     coverImage,
  //   };

  //   try {
  //     const res = await fetch("/api/teacher/profile", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();
  //     alert("Teacher profile submitted successfully!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Something went wrong.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("Session expired. Please login again.");
  //     setLoading(false);
  //     return;
  //   }

  //   const payload = {
  //     ...form,
  //     profileImage,
  //     coverImage,
  //   };

  //   try {
  //     const res = await fetch("http://localhost:4000/api/teacher/profile", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       console.error("Error Response:", data);
  //       alert(data.message || "Profile save failed.");
  //       return;
  //     }

  //     alert("Teacher profile saved successfully!");
  //     console.log("Saved Teacher Profile:", data);
  //   } catch (err) {
  //     console.error("Request failed:", err);
  //     alert("Internal error — check backend console.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const token = localStorage.getItem("token");

  //   const formData = new FormData();

  //   //Additional

  //   //formData.append("designation", form.designation);
  //   //formData.append("bio", bio);
  //   //form.append("department", department);
  //   //formData.append("experienceYears", experienceYears);

  //   for (const key in form) {
  //     formData.append(key, form[key]);
  //   }

  //   if (profileImage) {
  //     formData.append("profileImage", profileImage);
  //   }
  //   if (coverImage) {
  //     formData.append("coverImage", coverImage);
  //   }

  //   // Append text fields
  //   Object.keys(form).forEach((key) => {
  //     formData.append(key, form[key]);
  //   });

  //   // Append files (binary)
  //   if (profileImage) {
  //     formData.append("profileImage", profileImage);
  //   }

  //   if (coverImage) {
  //     formData.append("coverImage", coverImage);
  //   }

  //   for (const pair of formData.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }

  //   try {
  //     const res = await fetch("http://localhost:4000/api/teacher/profile", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         // ❗ DO NOT SET Content-Type manually
  //         //"Content-Type": "multipart/form-data",
  //       },
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     console.log(data);

  //     if (!res.ok) {
  //       alert(data.message || "Profile save failed.");
  //       return;
  //     }

  //     alert("Profile saved successfully!");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Network or server error.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //New handlesubmit

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
      const res = await fetch("http://localhost:4000/api/teacher/profile", {
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
      className="max-w-2xl mx-auto bg-white p-6 mt-10 shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Teacher Profile Form
      </h2>

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

        {/* Achievements */}
        <div>
          <label className="font-medium">Achievements</label>
          <textarea
            name="achievements"
            value={form.achievements}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Show case your achievements"
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="font-medium">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            onChange={(e) => handleFileUpload(e, setProfileImage)}
            accept="image/*"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="font-medium">Cover Image</label>
          <input
            type="file"
            name="coverImage"
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
