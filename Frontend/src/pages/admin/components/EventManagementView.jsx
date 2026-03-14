import React, { useState } from 'react';

export default function EventManagementView() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event & Announcement Management</h2>
          <p className="text-gray-500 text-sm mt-1">Create alumni events, manage RSVPs, and track participation.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create New Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 flex px-6 space-x-6">
          {['upcoming', 'past', 'announcements'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'announcements' ? 'Announcements' : `${tab} Events`}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Card Mock */}
            <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:border-blue-300 transition-colors">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 relative">
                 <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold border border-white/30">Upcoming</div>
                 <h3 className="text-white font-bold text-xl mt-4">Annual Alumni Meet 2026</h3>
                 <p className="text-blue-100 text-sm flex items-center mt-1">
                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   Dec 15, 2026
                 </p>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registrations</span>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">145 / 500</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '29%' }}></div>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                  <button className="text-sm text-gray-600 font-medium hover:text-indigo-600">Send Notification</button>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-800">Manage RSVPs →</button>
                </div>
              </div>
            </div>

            {/* Another Event... */}
            <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:border-blue-300 transition-colors">
              <div className="h-32 bg-gray-100 p-4 relative border-b border-gray-200">
                 <div className="absolute top-4 right-4 bg-gray-800 px-2 py-1 rounded text-white text-xs font-bold border border-gray-700">Registration Open</div>
                 <h3 className="text-gray-900 font-bold text-xl mt-4">TCS Placement Workshop</h3>
                 <p className="text-gray-600 text-sm flex items-center mt-1">
                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   Aug 10, 2026
                 </p>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registrations</span>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">85 / 100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                  <button className="text-sm text-gray-600 font-medium hover:text-indigo-600">Send Notification</button>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-800">Manage RSVPs →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
