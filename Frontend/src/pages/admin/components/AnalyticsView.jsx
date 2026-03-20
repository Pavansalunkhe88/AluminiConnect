import React from 'react';

export default function AnalyticsView() {
  const stats = [
    { label: 'Total Students', value: '4,200', trend: '+12% this year', trendUp: true },
    { label: 'Total Alumni', value: '1,850', trend: '+8% this year', trendUp: true },
    { label: 'Total Teachers', value: '142', trend: 'Stable', trendUp: true },
    { label: 'Verified Accounts', value: '6,020', trend: '97% of total', trendUp: true },
    { label: 'Active Mentorships', value: '315', trend: '+45 this month', trendUp: true },
    { label: 'Job Postings', value: '84', trend: 'Active now', trendUp: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard & Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">High-level insights about the Alumni Connect platform usage.</p>
        </div>
        <button className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-blue-200 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
            <dd className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-900">{stat.value}</span>
              <span className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-xs font-medium md:mt-2 lg:mt-0 ${stat.trendUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {stat.trend}
              </span>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px] flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">User Growth Over Time</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            {/* Placeholder for Recharts/Chart.js */}
            <p className="text-gray-400 font-medium flex flex-col items-center">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16m-10 4v1m0 4v1m0 4v1" /></svg>
              Line Chart Visualization
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px] flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Engagement by Role</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
             {/* Placeholder for Pie Chart */}
             <p className="text-gray-400 font-medium flex flex-col items-center">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              Pie Chart Visualization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
