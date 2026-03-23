import React, { useState } from 'react';
import axios from 'axios';

const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });

export default function AlumniCreationView() {
  const [form, setForm] = useState({ name: '', email: '', prn: '', graduationYear: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const departments = [
    'Computer Science and Engineering', 'Information Technology', 'Electronics and Telecommunication',
    'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
    'Artificial Intelligence and Data Science', 'Instrumentation Engineering',
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post('/api/admin/create-alumni', form, headers());
      setResult(res.data);
      setForm({ name: '', email: '', prn: '', graduationYear: '', department: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create alumni account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alumni Account Creation</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create alumni accounts with temporary credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Creation Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Create Alumni Account</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Past PRN Number *</label>
                <input type="text" name="prn" value={form.prn} onChange={handleChange} required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Graduation Year *</label>
                <input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
              <select name="department" value={form.department} onChange={handleChange} required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select department</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account & Generate Password'}
            </button>
          </form>
        </div>

        {/* Result / Info Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
          {result ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-3xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Created!</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Name:</strong> {result.user?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Email:</strong> {result.user?.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Temporary Password:</strong>
                  <code className="ml-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded font-mono text-xs">{result.user?.tempPassword}</code>
                </p>
              </div>
              <p className="text-xs text-gray-400">Share these credentials with the alumni securely.</p>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-4 inline-block">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Create Alumni Accounts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">Fill in the form to create a new alumni account. A temporary password will be generated automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
