import React, { useState } from 'react'; 
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Ban,
  UserCheck,
  Download,
  Eye
} from 'lucide-react';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const users = [
    {
      id: '001',
      name: 'John Developer',
      email: 'john.doe@company.com',
      role: 'employee',
      currentRole: 'Junior Developer',
      desiredRole: 'Senior Developer',
      level: 3,
      xp: 1250,
      status: 'active',
      lastActive: '2 hours ago',
      completionRate: 75,
      skillGaps: 3
    },
    {
      id: '002',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'employee',
      currentRole: 'Product Manager',
      desiredRole: 'Senior Product Manager',
      level: 5,
      xp: 2850,
      status: 'active',
      lastActive: '1 day ago',
      completionRate: 89,
      skillGaps: 2
    },
    {
      id: '003',
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      role: 'employee',
      currentRole: 'Designer',
      desiredRole: 'Lead Designer',
      level: 2,
      xp: 890,
      status: 'inactive',
      lastActive: '1 week ago',
      completionRate: 45,
      skillGaps: 5
    },
    {
      id: '004',
      name: 'Sarah Jones',
      email: 'sarah.jones@company.com',
      role: 'employee',
      currentRole: 'QA Engineer',
      desiredRole: 'QA Lead',
      level: 4,
      xp: 1950,
      status: 'active',
      lastActive: '30 minutes ago',
      completionRate: 92,
      skillGaps: 1
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const userStats = [
    { title: 'Total Users', value: users.length, color: 'blue' },
    { title: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'green' },
    { title: 'Avg. Completion', value: `${Math.round(users.reduce((acc, u) => acc + u.completionRate, 0) / users.length)}%`, color: 'purple' },
    { title: 'High Performers', value: users.filter(u => u.completionRate > 80).length, color: 'yellow' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage all platform users</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Users</span>
        </button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 dark:from-${stat.color}-900 dark:to-${stat.color}-800 p-6 rounded-xl border border-${stat.color}-200 dark:border-${stat.color}-700`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-${stat.color}-800 dark:text-${stat.color}-200`}>{stat.title}</p>
                <p className={`text-3xl font-bold text-${stat.color}-900 dark:text-white mt-2`}>{stat.value}</p>
              </div>
              <Users className={`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-300`} />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {['User', 'Role Transition', 'Progress', 'Status', 'Last Active', 'Actions'].map(header => (
                  <th key={header} className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">From: {user.currentRole}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">To: {user.desiredRole}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Level {user.level}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{user.xp} XP</span>
                      </div>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${user.completionRate}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.completionRate}% complete</span>
                        <span className="text-xs text-red-500">{user.skillGaps} gaps</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                    {user.lastActive}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Select all users</span>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Send Message</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Activate</span>
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
              <Ban className="w-4 h-4" />
              <span>Deactivate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
