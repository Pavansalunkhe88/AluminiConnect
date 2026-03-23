import React, { useState, useEffect } from 'react';
import axios from 'axios';

const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });

export default function TeacherVerificationView() {
  const [teachers, setTeachers] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, verified: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/pending-teachers', headers());
      setTeachers(res.data.teachers || []);
      setCounts(res.data.counts || {});
    } catch (err) {
      console.error('Fetch pending teachers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleVerify = async (id, name) => {
    setActionLoading(id);
    try {
      await axios.patch(`/api/admin/users/${id}/verify`, {}, headers());
      showToast(`${name} verified ✅`);
      fetchPending();
    } catch (err) {
      showToast(err.response?.data?.message || 'Verify failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject "${name}"?`)) return;
    setActionLoading(id);
    try {
      await axios.patch(`/api/admin/users/${id}/reject`, {}, headers());
      showToast(`${name} rejected`);
      fetchPending();
    } catch (err) {
      showToast(err.response?.data?.message || 'Reject failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>{toast.msg}</div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Verification</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Verify teacher registrations and assign access privileges.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">{counts.pending} Pending</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">{counts.verified} Verified</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : teachers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">🎉 No pending verifications</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">All teacher registrations are verified.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {teachers.map(t => (
                  <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                          {t.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {t.empId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {t.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleVerify(t._id, t.name)}
                        disabled={actionLoading === t._id}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                      >Approve</button>
                      <button
                        onClick={() => handleReject(t._id, t.name)}
                        disabled={actionLoading === t._id}
                        className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                      >Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
