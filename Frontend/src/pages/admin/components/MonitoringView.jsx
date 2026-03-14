import React from 'react';

export default function MonitoringView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Monitoring</h2>
        <p className="text-gray-500 text-sm mt-1">Real-time view of active users, connections, and system flagged events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-1">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Live Users</h3>
          <div className="flex items-end">
            <span className="text-4xl font-black text-green-500">142</span>
            <span className="ml-2 mb-1 text-sm text-gray-500">online now</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Students</span><span className="font-semibold">89</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Alumni</span><span className="font-semibold">45</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Teachers</span><span className="font-semibold">8</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-3 h-96 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
              Live Activity Stream
            </h3>
            <div className="flex space-x-2">
              <select className="text-sm border-gray-300 rounded-md py-1 px-2">
                <option>All Activities</option>
                <option>Connections</option>
                <option>Mentorships</option>
                <option>Alerts & Reports</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {[
              { type: 'connection', text: 'Student Rahul connected with Alumni Sneha (TCS)', time: 'Just now' },
              { type: 'post', text: 'Dr. Sharma posted a new Internship Opportunity', time: '2 mins ago' },
              { type: 'alert', text: 'Multiple failed login attempts for user prn2022091', time: '5 mins ago' },
              { type: 'connection', text: 'Alumni Meet 2026 event reached 100 RSVPs', time: '12 mins ago' },
              { type: 'message', text: 'New cross-department mentorship initiated in CS branch', time: '18 mins ago' },
            ].map((log, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 flex leading-5">
                <div className="mr-3 mt-0.5">
                  {log.type === 'alert' ? <span className="text-xl">⚠️</span> : 
                   log.type === 'connection' ? <span className="text-xl">🤝</span> :
                   <span className="text-xl">📊</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${log.type === 'alert' ? 'text-red-700 font-medium' : 'text-gray-800'}`}>{log.text}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap ml-2">{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
