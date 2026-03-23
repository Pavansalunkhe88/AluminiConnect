import React, { useState, useEffect } from 'react';
import axios from 'axios';

const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function MonitoringView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/admin/monitoring', headers());
      setData(res.data);
    } catch (err) {
      console.error('Monitoring error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getEmoji = (type) => {
    switch (type) {
      case 'connection': return '🤝';
      case 'post': return '📝';
      case 'alert': return '⚠️';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Monitoring</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Real-time view of user activity and platform events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-1">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Users</h3>
          <div className="flex items-end">
            <span className="text-4xl font-black text-green-500">{data?.liveUserCount || 0}</span>
            <span className="ml-2 mb-1 text-sm text-gray-500 dark:text-gray-400">registered</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Students</span><span className="font-semibold text-gray-900 dark:text-white">{data?.usersByRole?.students || 0}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Alumni</span><span className="font-semibold text-gray-900 dark:text-white">{data?.usersByRole?.alumni || 0}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Teachers</span><span className="font-semibold text-gray-900 dark:text-white">{data?.usersByRole?.teachers || 0}</span></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-3 h-96 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
              Activity Stream
            </h3>
            <span className="text-xs text-gray-400">Auto-refreshes every 30s</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {data?.activities?.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              data?.activities?.map((log, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex leading-5">
                  <div className="mr-3 mt-0.5 text-xl">{getEmoji(log.type)}</div>
                  <div className="flex-1">
                    <p className={`text-sm ${log.type === 'alert' ? 'text-red-700 dark:text-red-400 font-medium' : 'text-gray-800 dark:text-gray-200'}`}>{log.text}</p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap ml-2">{timeAgo(log.time)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
