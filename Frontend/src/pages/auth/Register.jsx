import React, { useState } from 'react'
// import './index.css'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    prn_number: '',
    emp_id: ''
  });

  const [status, setStatus] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Handle form input changes
  function onChange(e) {
    const { name, value } = e.target;

    setForm(prev => {
      const updated = { ...prev, [name]: value };

      // Check password match when confirm password changes
      if (name === 'confirmPassword' || name === 'password') {
        setPasswordMatch(
          updated.password === updated.confirmPassword || updated.confirmPassword === ''
        );
      }

      return updated;
    });
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setStatus({ error: 'Passwords do not match' });
      return;
    }

    // Validate required fields based on role
    if ((form.role === 'Student' || form.role === 'Alumni') && !form.prn_number) {
      setStatus({ error: 'PRN Number is required for Students and Alumni' });
      return;
    }

    if ((form.role === 'Teacher' || form.role === 'Admin') && !form.emp_id) {
      setStatus({ error: 'Employee ID is required for Teachers and Admins' });
      return;
    }

    setStatus('loading');

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      // Add role-specific fields
      if (form.role === 'Student' || form.role === 'Alumni') {
        payload.prn_number = form.prn_number;
      } else if (form.role === 'Teacher' || form.role === 'Admin') {
        payload.emp_id = form.emp_id;
      }

      // use axios
      const axios = (await import('axios')).default;
      const res = await axios.post('/api/register', payload);

      setStatus({ success: res.data.message || 'Registration successful!' });

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      // axios error handling
      const message = err?.response?.data?.error || err.message || 'Request failed';
      setStatus({ error: message });
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header Card */}
        <div className="bg-gray-50 rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-center">
            Join the Student-Alumni Portal
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-gray-50 rounded-lg shadow-md p-8">
          <form onSubmit={onSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
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
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
                placeholder="Enter your password"
                minLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                required
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                  !passwordMatch && form.confirmPassword 
                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                    : passwordMatch && form.confirmPassword && form.password
                    ? 'border-green-500 focus:ring-green-200 focus:border-green-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {!passwordMatch && form.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
              )}
              {passwordMatch && form.confirmPassword && form.password && (
                <p className="text-green-600 text-sm mt-1">Passwords match</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Student">Student</option>
                <option value="Alumni">Alumni</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Conditional Fields */}
            {(form.role === 'Student' || form.role === 'Alumni') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PRN Number *
                </label>
                <input
                  type="text"
                  name="prn_number"
                  value={form.prn_number}
                  onChange={onChange}
                  required
                  placeholder="Enter PRN number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            {(form.role === 'Teacher' || form.role === 'Admin') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="emp_id"
                  value={form.emp_id}
                  onChange={onChange}
                  required
                  placeholder="Enter employee ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading' || !passwordMatch}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                status === 'loading' || !passwordMatch
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {status === 'loading' ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Status Messages */}
            {status && status !== 'loading' && (
              <div className={`p-4 rounded-lg text-center ${
                status.error 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {status.error || status.success}
              </div>
            )}

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage
