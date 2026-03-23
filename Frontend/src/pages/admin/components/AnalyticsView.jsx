import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = (path) => axios.get(`/api/admin${path}`, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  withCredentials: true,
});

export default function AnalyticsView() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/dashboard-stats')
      .then(res => {
        setStats(res.data.stats);
        setRecentUsers(res.data.recentUsers || []);
      })
      .catch(err => console.error('Stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), trend: `${stats.totalUsers} total users`, color: 'blue' },
    { label: 'Total Alumni', value: stats.totalAlumni.toLocaleString(), trend: 'Registered alumni', color: 'indigo' },
    { label: 'Total Teachers', value: stats.totalTeachers.toLocaleString(), trend: 'Faculty members', color: 'purple' },
    { label: 'Verified Accounts', value: stats.totalVerified.toLocaleString(), trend: `${stats.verificationRate}% of total`, color: 'green' },
    { label: 'Total Posts', value: stats.totalPosts.toLocaleString(), trend: 'Community posts', color: 'orange' },
    { label: 'Connections', value: stats.totalConnections.toLocaleString(), trend: 'Active connections', color: 'pink' },
  ] : [];

  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard & Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Real-time platform insights from the database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.label}</dt>
            <dd className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</span>
              <span className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[stat.color]}`}>
                {stat.trend}
              </span>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Recent Registrations</h3>
        {recentUsers.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent users</p>
        ) : (
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                    {u.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{u.role}</span>
                  <p className="text-xs text-gray-400 mt-1">{new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
