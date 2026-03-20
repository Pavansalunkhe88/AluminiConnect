import React from 'react';

export default function AlumniCreationView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Alumni Account Creation</h2>
        <p className="text-gray-500 text-sm mt-1">Automatically create authentic alumni accounts and generate temporary credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bulk Upload Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Bulk Alumni Creation</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">Upload a CSV containing Alumni PRN, Name, Email, and Graduation Year to automatically provision accounts.</p>
          
          <div className="w-full max-w-sm border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <p className="text-sm font-medium text-blue-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">CSV/Excel up to 10MB</p>
          </div>
        </div>

        {/* Manual Creation Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Manual Creation</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Past PRN Number</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="pt-2">
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
                Create Account & Email Temp Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
