import React, { useState } from 'react'; 
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Clock
} from 'lucide-react';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('last30');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { id: 'overview', name: 'Platform Overview', icon: TrendingUp },
    { id: 'users', name: 'User Activity', icon: Users },
    { id: 'learning', name: 'Learning Progress', icon: BookOpen },
    { id: 'skills', name: 'Skill Gap Analysis', icon: Target },
    { id: 'performance', name: 'Performance Metrics', icon: Clock }
  ];

  const reportData = {
    overview: {
      title: 'Platform Overview Report',
      metrics: [
        { label: 'Total Active Users', value: '1,247', change: '+12%' },
        { label: 'Course Completions', value: '892', change: '+8%' },
        { label: 'Average Session Time', value: '45min', change: '+15%' },
        { label: 'User Satisfaction', value: '4.7/5', change: '+0.2' }
      ],
      insights: [
        'User engagement increased significantly this month',
        'JavaScript and Python remain the most popular skills',
        'Mobile usage has increased by 25%',
        'Average learning streak is 12 days'
      ]
    },
    users: {
      title: 'User Activity Report',
      metrics: [
        { label: 'New Registrations', value: '156', change: '+23%' },
        { label: 'Daily Active Users', value: '743', change: '+5%' },
        { label: 'User Retention Rate', value: '78%', change: '+3%' },
        { label: 'Churn Rate', value: '4.2%', change: '-1.1%' }
      ],
      insights: [
        'Peak usage hours are between 7-9 PM',
        'Weekend engagement dropped by 15%',
        'New user onboarding completion rate is 85%',
        'Most users prefer video-based learning'
      ]
    },
    learning: {
      title: 'Learning Progress Report',
      metrics: [
        { label: 'Total Learning Hours', value: '12,456', change: '+18%' },
        { label: 'Course Completion Rate', value: '76%', change: '+4%' },
        { label: 'Average XP per User', value: '1,850', change: '+12%' },
        { label: 'Certificates Issued', value: '234', change: '+28%' }
      ],
      insights: [
        'Adaptive quizzes show 20% better completion rates',
        'Mock interviews increase confidence scores by 30%',
        'Users with learning streaks perform 40% better',
        'Personalized paths reduce dropout by 25%'
      ]
    }
  };

  const currentReport = reportData[selectedReport as keyof typeof reportData] || reportData.overview;

  const generateReport = () => {
    alert(`Generating ${currentReport.title} for ${selectedPeriod}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Generate detailed reports on platform performance</p>
        </div>
        <button
          onClick={generateReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </button>
      </div>

      {/* Report Controls */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Report Type</label>
            <div className="grid grid-cols-1 gap-2">
              {reportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReport(type.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                      selectedReport === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Time Period</label>
            <div className="space-y-2">
              {[
                { id: 'last7', name: 'Last 7 days' },
                { id: 'last30', name: 'Last 30 days' },
                { id: 'last90', name: 'Last 3 months' },
                { id: 'last365', name: 'Last year' },
                { id: 'custom', name: 'Custom range' }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    selectedPeriod === period.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{period.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentReport.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {currentReport.metrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">{metric.label}</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">{metric.value}</p>
              <p className={`text-sm mt-1 ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change} vs previous period
              </p>
            </div>
          ))}
        </div>

        {/* Key Insights */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h4>
          <div className="space-y-3">
            {currentReport.insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium dark:text-gray-200">Export as PDF</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-all">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="font-medium dark:text-gray-200">Export as Excel</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900 transition-all">
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="font-medium dark:text-gray-200">Export as CSV</span>
          </button>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scheduled Reports</h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Add Schedule
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'Weekly User Activity Report', frequency: 'Every Monday', next: 'Dec 16, 2024' },
            { name: 'Monthly Learning Progress', frequency: 'First of each month', next: 'Jan 1, 2025' },
            { name: 'Quarterly Performance Review', frequency: 'Every 3 months', next: 'Mar 1, 2025' }
          ].map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{schedule.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{schedule.frequency} • Next: {schedule.next}</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors text-sm">
                  Edit
                </button>
                <button className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
