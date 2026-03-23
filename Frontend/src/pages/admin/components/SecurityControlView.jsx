import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });

export default function SecurityControlView() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [stats, setStats] = useState({ suspendedCount: 0, totalUsers: 0 });
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch security stats
  useEffect(() => {
    axios.get('/api/admin/security/stats', headers())
      .then(res => setStats(res.data))
      .catch(err => console.error('Security stats error:', err));
  }, []);

  // Debounced search
  const searchUsers = useCallback(async () => {
    if (search.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await axios.get(`/api/admin/security/search?q=${encodeURIComponent(search)}`, headers());
      setResults(res.data.users || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(searchUsers, 400);
    return () => clearTimeout(timer);
  }, [searchUsers]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSuspend = async (id, name) => {
    if (!window.confirm(`Suspend "${name}"? They will not be able to access the platform.`)) return;
    setActionLoading(id);
    try {
      await axios.patch(`/api/admin/users/${id}/suspend`, {}, headers());
      showToast(`${name} suspended`);
      searchUsers();
      const statsRes = await axios.get('/api/admin/security/stats', headers());
      setStats(statsRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Suspend failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsuspend = async (id, name) => {
    setActionLoading(id);
    try {
      await axios.patch(`/api/admin/users/${id}/unsuspend`, {}, headers());
      showToast(`${name} unsuspended ✅`);
      searchUsers();
      const statsRes = await axios.get('/api/admin/security/stats', headers());
      setStats(statsRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Unsuspend failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      await axios.delete(`/api/admin/users/${id}`, headers());
      showToast(`${name} deleted permanently`);
      searchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
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

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Control & Security</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Suspend, unsuspend, or permanently delete accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center rounded-t-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Enforcement</h3>
            <input
              type="text"
              placeholder="Search by name, email, PRN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          <div className="p-6">
            {search.length < 2 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Search for a user</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Type at least 2 characters to search.</p>
              </div>
            ) : searching ? (
              <div className="py-8 text-center text-gray-400">Searching...</div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-gray-400">No users found for "{search}"</div>
            ) : (
              <div className="space-y-3">
                {results.map(u => (
                  <div key={u._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold bg-gray-50 dark:bg-gray-700 text-sm">
                        {u.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{u.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{u.role} • {u.prn_number || u.emp_id || u.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {u.isActive === false ? (
                        <button onClick={() => handleUnsuspend(u._id, u.name)} disabled={actionLoading === u._id}
                          className="text-xs font-semibold px-3 py-1.5 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors disabled:opacity-50">
                          Unsuspend
                        </button>
                      ) : (
                        <button onClick={() => handleSuspend(u._id, u.name)} disabled={actionLoading === u._id}
                          className="text-xs font-semibold px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors disabled:opacity-50">
                          Suspend
                        </button>
                      )}
                      <button onClick={() => handleDelete(u._id, u.name)} disabled={actionLoading === u._id}
                        className="text-xs font-semibold px-3 py-1.5 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Security Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Security Overview
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Suspended Accounts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Currently blocked from login</p>
              </div>
              <span className="text-lg font-bold text-red-600">{stats.suspendedCount}</span>
            </li>
            <li className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Users</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">All registered accounts</p>
              </div>
              <span className="text-lg font-bold text-blue-600">{stats.totalUsers}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
