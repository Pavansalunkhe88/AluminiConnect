import React, { useState } from 'react';
import { 
  UsersIcon, 
  UserPlusIcon, 
  AcademicCapIcon, 
  MegaphoneIcon, 
  EyeIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  ArrowDownTrayIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

// We'll import these sub-components shortly
import UserDatabaseView from './components/UserDatabaseView';
import AlumniCreationView from './components/AlumniCreationView';
import TeacherVerificationView from './components/TeacherVerificationView';
import BroadcastView from './components/BroadcastView';
import MonitoringView from './components/MonitoringView';
import SecurityControlView from './components/SecurityControlView';
import AnalyticsView from './components/AnalyticsView';
import EventManagementView from './components/EventManagementView';
import DataImportExportView from './components/DataImportExportView';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  const navigation = [
    { id: 'analytics', name: 'Dashboard & Analytics', icon: ChartBarIcon },
    { id: 'users', name: 'User Database', icon: UsersIcon },
    { id: 'alumni-creation', name: 'Alumni Creation', icon: UserPlusIcon },
    { id: 'teacher-verification', name: 'Teacher Verification', icon: AcademicCapIcon },
    { id: 'broadcast', name: 'Credential Broadcast', icon: MegaphoneIcon },
    { id: 'monitoring', name: 'Platform Monitoring', icon: EyeIcon },
    { id: 'security', name: 'Control & Security', icon: ShieldCheckIcon },
    { id: 'events', name: 'Event Management', icon: CalendarIcon },
    { id: 'data', name: 'Data Import / Export', icon: ArrowDownTrayIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users': return <UserDatabaseView />;
      case 'alumni-creation': return <AlumniCreationView />;
      case 'teacher-verification': return <TeacherVerificationView />;
      case 'broadcast': return <BroadcastView />;
      case 'monitoring': return <MonitoringView />;
      case 'security': return <SecurityControlView />;
      case 'analytics': return <AnalyticsView />;
      case 'events': return <EventManagementView />;
      case 'data': return <DataImportExportView />;
      default: return <AnalyticsView />;
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)] rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 mt-6 mx-6 mb-6 transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Module</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage platform settings</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-r-4 border-blue-700 dark:border-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} 
                  aria-hidden="true" 
                />
                <span className="truncate whitespace-nowrap">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 transition-colors rounded-md"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" aria-hidden="true" />
            <span className="truncate whitespace-nowrap">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
