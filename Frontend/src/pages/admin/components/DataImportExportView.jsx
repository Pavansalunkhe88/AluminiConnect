import React, { useState } from 'react';
import axios from 'axios';

const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });

export default function DataImportExportView() {
  const [activeTab, setActiveTab] = useState('export');
  const [exporting, setExporting] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      showToast('Please select a CSV file first', 'error');
      return;
    }

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const res = await axios.post('/api/admin/import-users', formData, headers());

      showToast(`Successfully imported ${res.data.imported} users. Errors: ${res.data.errors}`);
      setImportFile(null);
      // Reset file input UI if needed
      document.getElementById('csv-upload').value = '';
    } catch (err) {
      showToast(err.response?.data?.message || 'Import failed', 'error');
      console.error('Import error:', err);
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async (type, title) => {
    setExporting(type);
    try {
      const res = await axios.get(`/api/admin/export-users?type=${type}`, {
        ...headers(),
        responseType: 'blob',
      });

      // Download the CSV
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_users_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showToast(`${title} exported successfully`);
    } catch (err) {
      showToast('Export failed', 'error');
      console.error('Export error:', err);
    } finally {
      setExporting(null);
    }
  };

  const exporters = [
    { type: 'all', title: 'Complete User Directory', desc: 'All registered students, alumni, and teachers.', icon: '👥' },
    { type: 'students', title: 'Student Records', desc: 'All student accounts with profile data.', icon: '🎓' },
    { type: 'alumni', title: 'Alumni Records', desc: 'Alumni profiles with graduation info.', icon: '🏛️' },
    { type: 'teachers', title: 'Teacher Records', desc: 'Faculty accounts with department data.', icon: '👩‍🏫' },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>{toast.msg}</div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Import & Export</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Export user data as CSV files.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
            activeTab === 'export'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('export')}
        >
          Export Data
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
            activeTab === 'import'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('import')}
        >
          Import Data
        </button>
      </div>

      {activeTab === 'export' ? (
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-indigo-600 inline-block">Data Export (CSV)</h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            {exporters.map((exp) => (
              <div key={exp.type} className="flex justify-between items-center p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{exp.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{exp.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">{exp.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleExport(exp.type, exp.title)}
                  disabled={exporting === exp.type}
                  className="ml-4 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 p-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  title="Download CSV"
                >
                  {exporting === exp.type ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-indigo-600 inline-block">Data Import (CSV)</h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Upload CSV Document</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Required headers: role, name, email, prn_number (for students/alumni) or emp_id (for teachers).</p>
              
              <input 
                type="file" 
                id="csv-upload" 
                accept=".csv" 
                onChange={handleFileChange}
                className="hidden" 
              />
              <label 
                htmlFor="csv-upload" 
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Select File
              </label>
            </div>
            
            {importFile && (
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center truncate mr-4">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{importFile.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">({(importFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors cursor-pointer flex-shrink-0"
                >
                  {importing ? 'Importing...' : 'Upload & Process'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
