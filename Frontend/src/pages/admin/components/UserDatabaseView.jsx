import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });

export default function UserDatabaseView() {
  const [activeTab, setActiveTab] = useState('Student');
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ students: 0, teachers: 0, alumni: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/users?role=${activeTab}&search=${search}`, headers());
      setUsers(res.data.users || []);
      setCounts(res.data.counts || {});
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will remove all their data.`)) return;
    setActionLoading(id);
    try {
      await axios.delete(`/api/admin/users/${id}`, headers());
      showToast(`${name} deleted successfully`);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerify = async (id, name) => {
    setActionLoading(id);
    try {
      await axios.patch(`/api/admin/users/${id}/verify`, {}, headers());
      showToast(`${name} verified successfully`);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Verify failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { key: 'Student', label: 'Students', count: counts.students },
    { key: 'Alumni', label: 'Alumni', count: counts.alumni },
    { key: 'Teacher', label: 'Teachers', count: counts.teachers },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>{toast.msg}</div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Database Management</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage all platform users — search, verify, or remove accounts.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label} <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}s by name, email, PRN...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-56" />
                  </div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-400 dark:text-gray-500">
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm mt-1">Try a different search or role filter.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Identifier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {u.prn_number ? `PRN: ${u.prn_number}` : u.emp_id ? `Emp: ${u.emp_id}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {u.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!u.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Suspended</span>
                      ) : u.verified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {!u.verified && u.isActive && (
                        <button
                          onClick={() => handleVerify(u._id, u.name)}
                          disabled={actionLoading === u._id}
                          className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                        >Verify</button>
                      )}
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        disabled={actionLoading === u._id}
                        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                      >Delete</button>
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
