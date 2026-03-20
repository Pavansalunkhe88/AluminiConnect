import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../ui/Card';
import {Link} from "react-router-dom"
import StudentFeed from '../../pages/student/Feed';
import StudentProfile from '../../pages/student/Profile';
import Messages from '../../pages/Messages';
import AlumniProfile from '../../pages/alumni/Profile';
import AlumniFeed from '../../pages/alumni/Feed';
import TeacherFeed from '../../pages/teacher/Feed';
import TeacherProfile from '../../pages/teacher/Profile';
import RoleDashboard from '../Dashboard/RoleDashboard';
import Directory from '../../pages/Directory';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Derive active tab from current URL path instead of React state
  // This ensures the correct tab stays active on page reload
  const getActiveTabFromPath = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/feed')) return 'feed';
    if (path.includes('/directory')) return 'directory';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/manage')) return 'manage';
    return 'dashboard';
  };

  const activeTab = getActiveTabFromPath();

  // Navigate to the correct URL when a tab is clicked
  const handleTabClick = (tab) => {
    if (tab === activeTab) return;
    const basePath = `/${role}`;
    switch (tab) {
      case 'dashboard':
        navigate(`${basePath}/dashboard`);
        break;
      case 'feed':
        navigate(`${basePath}/feed`);
        break;
      case 'directory':
        navigate(`${basePath}/directory`);
        break;
      case 'messages':
        navigate(`${basePath}/messages`);
        break;
      case 'notifications':
        navigate(`${basePath}/notifications`);
        break;
      case 'profile':
        navigate(`${basePath}/profile`);
        break;
      default:
        navigate(`${basePath}/dashboard`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  const getFeedComponent = () => {
    switch (role) {
      case 'student':
        return StudentFeed;
      case 'alumni':
        return AlumniFeed;
      case 'teacher':
        return TeacherFeed;
      default:
        return () => (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Feed</h2>
            <p className="text-gray-600">No feed available for this role</p>
          </Card>
        );
    }
  };

  const getProfileComponent = () => {
    switch (role) {
      case 'student':
        return StudentProfile;
      case 'alumni':
        return AlumniProfile;
      case 'teacher':
        return TeacherProfile;
      default:
        return () => (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-gray-600">Profile settings coming soon</p>
          </Card>
        );
    }
  };

  const getMessagesComponent = () => {
    return Messages;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to={'/dashboard'} className="text-2xl font-bold text-blue-600">Alumni Connect</Link>
            
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Dashboard */}
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`p-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                title="Dashboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>

              {/* Feed */}
              <button
                onClick={() => handleTabClick('feed')}
                className={`p-2 rounded-lg transition-colors ${activeTab === 'feed' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                title="Feed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </button>

              {/* Directory */}
              <button
                onClick={() => setActiveTab('connections')}
                className={`px-3 py-2 font-medium ${activeTab === 'connections' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Connections
              </button>

              {/* Messages */}
              <button
                onClick={() => handleTabClick('messages')}
                className={`p-2 rounded-lg transition-colors ${activeTab === 'messages' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                title="Messages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* Notifications */}
              <button
                onClick={() => handleTabClick('notifications')}
                className={`p-2 rounded-lg transition-colors relative ${activeTab === 'notifications' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                title="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">5</span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    src={user?.profileImage?.url || 'https://ui-avatars.com/api/?name=' + user?.name}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        handleTabClick('profile');
                        setShowProfileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 border-t"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div key="dashboard">
              <RoleDashboard />
            </div>
          )}
          {activeTab === 'feed' && (
            <div key="feed">
              {React.createElement(getFeedComponent())}
            </div>
          )}
          {activeTab === 'directory' && (
            <div key="directory">
              <Directory />
            </div>
          )}
          {activeTab === 'messages' && (
            <div key="messages">
              {React.createElement(getMessagesComponent())}
            </div>
          )}
          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <p className="text-gray-600">Your notifications will appear here</p>
            </Card>
          )}
          {activeTab === 'profile' && (
            <div key="profile">
              {React.createElement(getProfileComponent())}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;