import React, { useState } from 'react';

export default function DataImportExportView() {
  const [activeTab, setActiveTab] = useState('import');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Import & Export</h2>
          <p className="text-gray-500 text-sm mt-1">Manage bulk data operations via CSV files for users and reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Import Section */}
        <div className={`transition-opacity ${activeTab === 'export' ? 'opacity-50' : ''}`} onClick={() => setActiveTab('import')}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 inline-block">Bulk Import (CSV)</h3>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            
            {/* Importer 1 */}
            <div className="border border-dashed border-gray-300 rounded-lg p-5 text-center hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <h4 className="font-bold text-gray-900">Upload Student PRN Data</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Upload the official university PRN list to auto-verify new student sign-ups.</p>
              <button className="mt-4 text-sm font-semibold text-blue-600">Select CSV/Excel File</button>
            </div>

            {/* Importer 2 */}
            <div className="border border-dashed border-gray-300 rounded-lg p-5 text-center hover:bg-green-50 hover:border-green-400 transition-colors cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h4 className="font-bold text-gray-900">Upload Alumni Records</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Batch import past students with Graduation Year and PRN.</p>
              <button className="mt-4 text-sm font-semibold text-green-600">Select CSV/Excel File</button>
            </div>

            {/* Importer 3 */}
            <div className="border border-dashed border-gray-300 rounded-lg p-5 text-center hover:bg-purple-50 hover:border-purple-400 transition-colors cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
              </div>
              <h4 className="font-bold text-gray-900">Upload Teacher IDs</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Upload Employee IDs to verify faculty registrations.</p>
              <button className="mt-4 text-sm font-semibold text-purple-600">Select CSV/Excel File</button>
            </div>

          </div>
        </div>

        {/* Export Section */}
        <div className={`transition-opacity ${activeTab === 'import' ? 'opacity-50' : ''}`} onClick={() => setActiveTab('export')}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600 inline-block">Data Export (Reporting)</h3>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            
            {/* Exporter UI List */}
            {[
              { title: 'Complete User Directory', desc: 'All registered students, alumni, and teachers with profile data.', icon: '👥' },
              { title: 'Verified Student List', desc: 'Students verified successfully against PRN database.', icon: '✅' },
              { title: 'Alumni Placement Report', desc: 'Employment data scraped from Alumni profiles.', icon: '💼' },
              { title: 'System Activity Logs', desc: 'Login dates, interactions, and security flags (30 days).', icon: '📝' },
            ].map((exporter, i) => (
              <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{exporter.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{exporter.title}</h4>
                    <p className="text-xs text-gray-500 max-w-xs">{exporter.desc}</p>
                  </div>
                </div>
                <button className="ml-4 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg" title="Download CSV">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
