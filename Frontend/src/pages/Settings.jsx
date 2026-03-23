import React, { useContext, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Card } from '../components/ui/Card';
import { 
  SunIcon, MoonIcon, BellIcon, ShieldCheckIcon, 
  UserIcon, KeyIcon, GlobeAltIcon, EnvelopeIcon, DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { settings, updateSettings, loading } = useContext(SettingsContext);
  const [activeTab, setActiveTab] = useState('account');

  if (loading && !settings?._id) {
    return (
      <Card className="p-8 mt-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'account', name: 'Account', icon: UserIcon },
    { id: 'appearance', name: 'Appearance', icon: SunIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheckIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Settings Navigation Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Control your account and platform experience.
          </p>
        </div>
        
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1">
        
        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <GlobeAltIcon className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Language & Region</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Display Language</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language.</p>
                  </div>
                  <select 
                    value={settings?.language || 'en'}
                    onChange={(e) => updateSettings({ language: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10">
              <div className="flex items-center mb-4 border-b border-red-100 dark:border-red-900/30 pb-4">
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Deactivate Account</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Temporarily hide your profile and data.</p>
                  </div>
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 dark:border-red-800 dark:text-red-400 transition-colors">
                    Deactivate
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* APPEARANCE TAB */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <SunIcon className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Theme</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Theme Preference</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adapt the platform's colors.</p>
                  </div>
                  <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <button
                      onClick={() => updateSettings({ theme: 'light' })}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${settings?.theme === 'light' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                    >
                      <SunIcon className="w-4 h-4 mr-2" /> Light
                    </button>
                    <button
                      onClick={() => updateSettings({ theme: 'dark' })}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${settings?.theme === 'dark' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                    >
                      <MoonIcon className="w-4 h-4 mr-2" /> Dark
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <EnvelopeIcon className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Email Notifications</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Direct Messages</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emails when you receive a message.</p>
                  </div>
                  <ToggleSwitch 
                    enabled={settings?.emailNotifications?.messages} 
                    onChange={(val) => updateSettings({ emailNotifications: { messages: val }})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Platform Updates</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emails about new features and events.</p>
                  </div>
                  <ToggleSwitch 
                    enabled={settings?.emailNotifications?.updates} 
                    onChange={(val) => updateSettings({ emailNotifications: { updates: val }})} 
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <DevicePhoneMobileIcon className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Push Notifications</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Messages & Alerts</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Instant web push notifications.</p>
                  </div>
                  <ToggleSwitch 
                    enabled={settings?.pushNotifications?.messages} 
                    onChange={(val) => updateSettings({ pushNotifications: { messages: val }})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Mentions</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">When someone tags you in a post.</p>
                  </div>
                  <ToggleSwitch 
                    enabled={settings?.pushNotifications?.mentions} 
                    onChange={(val) => updateSettings({ pushNotifications: { mentions: val }})} 
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* PRIVACY TAB */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Privacy</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Profile Visibility</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Who can discover your profile.</p>
                  </div>
                  <select 
                    value={settings?.privacy?.profileVisibility || 'public'}
                    onChange={(e) => updateSettings({ privacy: { profileVisibility: e.target.value }})}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Show Email Address</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Display email on your public profile.</p>
                  </div>
                  <ToggleSwitch 
                    enabled={settings?.privacy?.showEmail} 
                    onChange={(val) => updateSettings({ privacy: { showEmail: val }})} 
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <KeyIcon className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Security</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Require an extra code when logging in.</p>
                  </div>
                  <ToggleSwitch 
                    enabled={settings?.twoFactorAuth} 
                    onChange={(val) => updateSettings({ twoFactorAuth: val })} 
                  />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password regularly.</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    Update
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Extracted reusable toggle component
const ToggleSwitch = ({ enabled, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      className="sr-only peer" 
      checked={enabled || false}
      onChange={(e) => onChange(e.target.checked)}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
);

export default Settings;
