import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

const dashboardConfigs = {
  student: {
    welcomeMessage: (name) => `Welcome, ${name}!`,
    subtitle: (prn) => `PRN: ${prn}`,
    stats: [
      { label: "Events Attended", value: "12" },
      { label: "Alumni Connections", value: "45" },
      { label: "Learning Hours", value: "120" },
      { label: "Projects Completed", value: "8" }
    ],
    actions: [
      {
        title: "Connect with Alumni",
        description: "Find and connect with alumni in your field",
        buttonText: "Browse Directory",
        onClick: () => {},
        icon: '👥'
      },
      {
        title: "Upcoming Events",
        description: "View and register for upcoming events",
        buttonText: "View Events",
        onClick: () => {},
        icon: '📅'
      },
      {
        title: "Learning Resources",
        description: "Access educational materials and courses",
        buttonText: "Start Learning",
        onClick: () => {},
        icon: '📚'
      }
    ],
    activities: [
      {
        type: "connection",
        title: "New Connection",
        description: "Connected with John Doe from Tech Corp",
        timestamp: "2 hours ago"
      },
      {
        type: "event",
        title: "Event Registration",
        description: "Registered for Career Workshop",
        timestamp: "1 day ago"
      }
    ]
  },
  alumni: {
    welcomeMessage: (name) => `Welcome back, ${name}!`,
    subtitle: (year) => `Class of ${year}`,
    stats: [
      { label: "Students Mentored", value: "8" },
      { label: "Events Hosted", value: "3" },
      { label: "Resources Shared", value: "15" },
      { label: "Network Size", value: "120" }
    ],
    actions: [
      {
        title: "Job Board",
        description: "Post or find job opportunities",
        buttonText: "View Jobs",
        onClick: () => {},
        icon: '💼'
      },
      {
        title: "Mentor Students",
        description: "Guide and support current students",
        buttonText: "Start Mentoring",
        onClick: () => {},
        icon: '🎓'
      },
      {
        title: "Share Story",
        description: "Share your success story",
        buttonText: "Share Now",
        onClick: () => {},
        icon: '📖'
      }
    ],
    activities: [
      {
        type: "mentorship",
        title: "New Mentee",
        description: "Started mentoring Jane Smith",
        timestamp: "3 hours ago"
      },
      {
        type: "post",
        title: "Career Insight",
        description: "Posted about industry trends",
        timestamp: "2 days ago"
      }
    ]
  },
  teacher: {
    welcomeMessage: (name) => `Welcome, Prof. ${name}!`,
    subtitle: (department) => `Department: ${department}`,
    stats: [
      { label: "Active Students", value: "150" },
      { label: "Course Materials", value: "25" },
      { label: "Avg. Performance", value: "85%" },
      { label: "Office Hours", value: "10" }
    ],
    actions: [
      {
        title: "Student Management",
        description: "View and manage student records",
        buttonText: "Manage Students",
        onClick: () => {},
        icon: '👨‍🎓'
      },
      {
        title: "Course Management",
        description: "Update course materials and assignments",
        buttonText: "Manage Courses",
        onClick: () => {},
        icon: '📚'
      },
      {
        title: "Reports",
        description: "Generate and view reports",
        buttonText: "View Reports",
        onClick: () => {},
        icon: '📈'
      }
    ],
    activities: [
      {
        type: "course",
        title: "Course Update",
        description: "Updated Database Management syllabus",
        timestamp: "1 hour ago"
      },
      {
        type: "meeting",
        title: "Office Hours",
        description: "Meeting with CS401 students",
        timestamp: "1 day ago"
      }
    ]
  }
};

const ActivityItem = ({ activity }) => (
  <div className="p-4 hover:bg-gray-50">
    <div className="flex items-center">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
        <p className="text-sm text-gray-600">{activity.description}</p>
      </div>
      <span className="text-xs text-gray-500">{activity.timestamp}</span>
    </div>
  </div>
);

const RoleDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Get the configuration based on user role
  const currentConfig = dashboardConfigs[user?.role?.toLowerCase()] || dashboardConfigs.student;

  if (!currentConfig) {
    return <div>Invalid user role</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentConfig.welcomeMessage(user?.name || 'User')}
        </h1>
        <p className="text-gray-600">
          {currentConfig.subtitle(
            user?.role === 'student' ? user?.prn_number || 'N/A'
            : user?.role === 'alumni' ? user?.graduation_year || 'N/A'
            : user?.department || 'N/A'
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {currentConfig.stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            {stat.change && (
              <p className={`text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}% from last month
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentConfig.actions.map((action, index) => (
            <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                {action.icon && <span className="text-2xl mr-4">{action.icon}</span>}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <button
                    onClick={action.onClick}
                    className="text-blue-600 font-semibold hover:text-blue-800"
                  >
                    {action.buttonText} →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card className="divide-y divide-gray-200">
          {currentConfig.activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </Card>
      </div>
    </div>
  );
};

export default RoleDashboard;