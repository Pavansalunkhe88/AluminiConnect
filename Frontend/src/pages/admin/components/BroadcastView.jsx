import React, { useState } from 'react';

export default function BroadcastView() {
  const [audience, setAudience] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Credential Broadcast System</h2>
          <p className="text-gray-500 text-sm mt-1">Send login credentials, announcements, or event notifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[600px]">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Compose Broadcast</h3>
          
          <div className="space-y-4 flex-1 flex flex-col">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="all">Every Registered User</option>
                <option value="alumni">All Alumni</option>
                <option value="students">Current Students</option>
                <option value="teachers">College Staff & Teachers</option>
                <option value="custom">Custom List (Upload CSV)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" placeholder="e.g. Upcoming Alumni Meet 2026!" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex space-x-2">
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold">B</button>
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600 italic">I</button>
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600 underline">U</button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Link
                </button>
              </div>
              <textarea 
                className="w-full flex-1 border-x border-b border-gray-300 rounded-b-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans"
                placeholder="Write your announcement here..."
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium mr-3 hover:bg-gray-200">Save Draft</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                Send Broadcast
              </button>
            </div>
          </div>
        </div>

        {/* Templates Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Templates</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <div className="font-semibold text-gray-900 group-hover:text-blue-700">Send Login Credentials</div>
              <div className="text-xs text-gray-500 mt-1">Generates email with temp password for new users.</div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <div className="font-semibold text-gray-900 group-hover:text-blue-700">Alumni Meet Invitation</div>
              <div className="text-xs text-gray-500 mt-1">Template for annual gatherings.</div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <div className="font-semibold text-gray-900 group-hover:text-blue-700">Internship/Job Alert</div>
              <div className="text-xs text-gray-500 mt-1">Share opportunities with students.</div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg border-dashed hover:border-gray-400 hover:bg-gray-50 transition-colors text-center text-sm font-medium text-gray-600">
              + Create Custom Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
