import React, { useState } from 'react';

export default function SecurityControlView() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Control & Security</h2>
        <p className="text-gray-500 text-sm mt-1">Suspend problematic users, review blocked accounts, and reset passwords securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Action Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center rounded-t-xl">
            <h3 className="text-lg font-bold text-gray-900">User Enforcement Actions</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search user by Email/PRN..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          
          <div className="p-6 text-center py-16">
            <div className="mx-auto w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900">Search for a user to take action</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">You can suspend accounts, force password resets, or permanently delete accounts from here.</p>
            
            {/* Mocked Search Result that appears if typing */}
            {search.length > 2 && (
              <div className="mt-8 text-left border border-gray-200 rounded-lg p-4 bg-white shadow-sm max-w-lg mx-auto flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 font-bold bg-gray-50">JD</div>
                  <div className="ml-3">
                    <div className="text-sm font-bold text-gray-900">John Doe</div>
                    <div className="text-xs text-gray-500">Student • PRN: 202100abc</div>
                  </div>
                </div>
                <div className="space-x-2">
                  <button className="text-xs font-semibold px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors">Force Logout</button>
                  <button className="text-xs font-semibold px-3 py-1.5 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">Suspend</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Summary Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Security Overview
          </h3>
          
          <ul className="space-y-4">
            <li className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-900">Suspended Accounts</p>
                <p className="text-xs text-gray-500">Currently blocked from login</p>
              </div>
              <span className="text-lg font-bold text-red-600">3</span>
            </li>
            <li className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-900">Inactive Accounts</p>
                <p className="text-xs text-gray-500">No login for 365+ days</p>
              </div>
              <span className="text-lg font-bold text-yellow-600">124</span>
              {/* <button className="text-xs text-blue-600 font-medium">Auto-clean</button> */}
            </li>
            <li className="flex flex-col pt-2">
              <button className="w-full text-center py-2 text-sm text-blue-600 font-medium border border-blue-600 rounded hover:bg-blue-50 transition-colors">
                View System Action Logs
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
