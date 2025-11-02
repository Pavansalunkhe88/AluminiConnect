import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState(null);

  // Handle form input changes
  function onChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();

    setStatus("loading");

    try {
      const axios = (await import("axios")).default;
      //const res = await axios.post("/api/login", form);
      
      const res = await axios.post("/api/login", form, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const data = res.data;

      // Store token and user data
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      setStatus({ success: data.message || "Login successful!" });

      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      console.log(err.response?.data);
      const message =
        err?.response?.data?.error || err.message || "Login failed";
      setStatus({ error: message });
    }
  }

  return (
    
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header Card */}
        <div className="bg-gray-50 rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-center">Sign in to AlumniConnect</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-gray-50 rounded-lg shadow-md p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* role selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={form.role || ""}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="alumni">Alumni</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              {status === "loading" ? "Signing in..." : "Sign In"}
            </button>

            {/* Status Messages */}
            {status && status !== "loading" && (
              <div
                className={`p-4 rounded-lg text-center ${
                  status.error
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                {status.error || status.success}
              </div>
            )}

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
