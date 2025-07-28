import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Mail,
  Briefcase,
  Target,
  Edit3,
  Save,
  X,
  Award,
  Calendar
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentRole: user?.currentRole || '',
    desiredRole: user?.desiredRole || ''
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentRole: user?.currentRole || '',
      desiredRole: user?.desiredRole || ''
    });
    setIsEditing(false);
  };

  const profileStats = [
    { label: 'Level', value: user?.level || 1, icon: Award, color: 'blue' },
    { label: 'XP Points', value: user?.xp || 0, icon: Target, color: 'purple' },
    { label: 'Badges Earned', value: user?.badges?.length || 0, icon: Award, color: 'yellow' },
    { label: 'Days Active', value: '28', icon: Calendar, color: 'green' }
  ];

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and learning preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {profileStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 dark:from-${stat.color}-900 dark:to-${stat.color}-800 p-6 rounded-xl border border-${stat.color}-200 dark:border-${stat.color}-700`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-${stat.color}-800 dark:text-${stat.color}-300`}>{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-900 dark:text-${stat.color}-100 mt-2`}>{stat.value}</p>
                </div>
                <IconComponent className={`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-300`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
          <div className="space-y-4">
            {['name', 'email', 'currentRole', 'desiredRole'].map((field, idx) => {
              const labelMap: Record<string, any> = {
                name: ['Full Name', User],
                email: ['Email Address', Mail],
                currentRole: ['Current Role', Briefcase],
                desiredRole: ['Desired Role', Target]
              };
              const [labelText, Icon] = labelMap[field];
              return (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Icon className="w-4 h-4 inline mr-2" />
                    {labelText}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={(formData as any)[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{(user as any)[field] || 'Not specified'}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Current Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.length ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Earned Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {user?.badges?.length ? (
                user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{badge}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm col-span-2">No badges earned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6">Learning Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preferred Learning Path</label>
            <div className="space-y-2">
              {['free', 'premium'].map((path, idx) => (
                <label key={idx} className="flex items-center">
                  <input type="radio" name="learningPath" value={path} className="mr-2" defaultChecked={path === 'free'} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {path === 'free' ? 'Free Path - Basic content and community support' : 'Premium Path - Full access with mentorship'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Difficulty Preference</label>
            <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="adaptive">Adaptive (Recommended)</option>
              <option value="beginner">Always Beginner</option>
              <option value="intermediate">Always Intermediate</option>
              <option value="advanced">Always Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Learning Data
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Reset Progress
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
