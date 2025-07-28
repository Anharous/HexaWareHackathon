import React, { useState } from 'react';
import {
  Settings,
  Server,
  Database,
  Shield,
  Bell,
  Mail,
  Users,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'integrations', name: 'Integrations', icon: Globe },
    { id: 'system', name: 'System', icon: Server }
  ];

  const systemStatus = [
    { service: 'API Server', status: 'healthy', uptime: '99.9%', responseTime: '120ms' },
    { service: 'Database', status: 'healthy', uptime: '99.8%', responseTime: '45ms' },
    { service: 'File Storage', status: 'healthy', uptime: '99.9%', responseTime: '200ms' },
    { service: 'Email Service', status: 'warning', uptime: '98.5%', responseTime: '1.2s' },
    { service: 'AI Services', status: 'healthy', uptime: '99.7%', responseTime: '850ms' }
  ];

const renderTabContent = () => {
  switch (activeTab) {
    case 'general':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform Name</label>
                <input
                  type="text"
                  defaultValue="SkillForge"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Language</label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Zone</label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Users</label>
                <input
                  type="number"
                  defaultValue="5000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Toggles</h3>
            <div className="space-y-4">
              {[
                { name: 'Enable AI Mock Interviews', enabled: true },
                { name: 'Allow Resume Upload', enabled: true },
                { name: 'Enable Adaptive Quizzes', enabled: true },
                { name: 'Show Leaderboards', enabled: false },
                { name: 'Enable Social Features', enabled: false }
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">{feature.name}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={feature.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'security':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Authentication Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Require Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Force all users to enable 2FA</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Security</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rate Limit (requests/minute)</label>
                <input
                  type="number"
                  defaultValue="1000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <Shield className="w-4 h-4 inline mr-2" />
                  API keys are rotated automatically every 90 days for security
                </p>
              </div>
            </div>
          </div>
        </div>
      );

     case 'notifications': 
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { name: 'User Registration', enabled: true, description: 'Send welcome email to new users' },
            { name: 'Course Completion', enabled: true, description: 'Notify when users complete courses' },
            { name: 'Weekly Progress', enabled: false, description: 'Send weekly progress summaries' },
            { name: 'System Alerts', enabled: true, description: 'Critical system notifications' },
            { name: 'Marketing Updates', enabled: false, description: 'Product updates and news' }
          ].map((notification, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{notification.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SMTP Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Server</label>
            <input
              type="text"
              defaultValue="smtp.gmail.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Port</label>
            <input
              type="number"
              defaultValue="587"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
            <input
              type="text"
              defaultValue="noreply@skillforge.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

case 'system':
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
        <div className="space-y-3">
          {systemStatus.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  service.status === 'healthy' ? 'bg-green-500' : 
                  service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium text-gray-900 dark:text-white">{service.service}</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span>Uptime: {service.uptime}</span>
                <span>Response: {service.responseTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="font-medium dark:text-white">Backup Database</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-all">
            <RefreshCw className="w-5 h-5 text-green-600" />
            <span className="font-medium dark:text-white">Clear Cache</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900 transition-all">
            <Server className="w-5 h-5 text-purple-600" />
            <span className="font-medium dark:text-white">Restart Services</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900 transition-all">
            <Users className="w-5 h-5 text-orange-600" />
            <span className="font-medium dark:text-white">Cleanup Users</span>
          </button>
        </div>
      </div>
    </div>
  );

default:
  return null;
}
}
return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Configure platform settings and manage system operations</p>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
        <Save className="w-4 h-4" />
        <span>Save Changes</span>
      </button>
    </div>

    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  </div>
);
}