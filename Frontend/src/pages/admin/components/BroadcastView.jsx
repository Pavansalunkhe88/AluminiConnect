import React, { useState } from 'react';
import axios from 'axios';

const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });

export default function BroadcastView() {
  const [audience, setAudience] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const templates = [
    { name: 'Welcome Message', subject: 'Welcome to AlumniConnect!', body: 'We are excited to have you join the AlumniConnect platform. Explore features like mentorship, job postings, and event notifications.' },
    { name: 'Alumni Meet Invitation', subject: 'Annual Alumni Meet 2026 — You\'re Invited!', body: 'Dear Alumni,\n\nWe are pleased to invite you to the Annual Alumni Meet 2026. Join us for an evening of networking, memories, and celebrations.' },
    { name: 'Internship/Job Alert', subject: 'New Opportunities Available', body: 'Check out the latest internship and job opportunities posted by our alumni network. Visit the platform to explore.' },
  ];

  const applyTemplate = (tmpl) => {
    setSubject(tmpl.subject);
    setMessage(tmpl.body);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      showToast('Subject and message are required', 'error');
      return;
    }
    setSending(true);
    // This is a UI demonstration — in production, wire to a real endpoint
    setTimeout(() => {
      setSending(false);
      showToast(`Broadcast sent to ${audience === 'all' ? 'all users' : audience}!`);
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>{toast.msg}</div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Credential Broadcast System</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Send announcements and messages to platform users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Compose Broadcast</h3>
          
          <div className="space-y-4 flex-1 flex flex-col">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
              <select value={audience} onChange={e => setAudience(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="all">Every Registered User</option>
                <option value="alumni">All Alumni</option>
                <option value="students">Current Students</option>
                <option value="teachers">College Staff & Teachers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Upcoming Alumni Meet 2026!"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400" />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Body</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full flex-1 min-h-[200px] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Write your announcement here..."
              />
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={handleSend} disabled={sending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm flex items-center transition-colors disabled:opacity-50">
                {sending ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Send Broadcast
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Templates</h3>
          <div className="space-y-3">
            {templates.map((tmpl, i) => (
              <button key={i} onClick={() => applyTemplate(tmpl)}
                className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group cursor-pointer">
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">{tmpl.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tmpl.subject}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
