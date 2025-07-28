import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  Star
} from 'lucide-react';

export default function Overview() {
  const { user } = useAuth();
  const { quizzes, learningModules, skillGaps } = useData();

  const completedQuizzes = quizzes.filter(q => q.completed).length;
  const completedModules = learningModules.filter(m => m.completed).length;

  const stats = [
    {
      title: 'Current Level',
      value: user?.level || 1,
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900'
    },
    {
      title: 'XP Points',
      value: user?.xp || 0,
      icon: Star,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900'
    },
    {
      title: 'Skill Gaps',
      value: skillGaps.length,
      icon: Target,
      color: 'from-red-400 to-red-500',
      bgColor: 'from-red-50 to-red-50 dark:from-red-900 dark:to-red-900'
    },
    {
      title: 'Completed Modules',
      value: completedModules,
      icon: CheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'from-green-50 to-green-50 dark:from-green-900 dark:to-green-900'
    }
  ];

  const recentActivity = [
    { type: 'quiz', title: 'Completed React Fundamentals Quiz', time: '2 hours ago', score: '85%' },
    { type: 'module', title: 'Watched Python Advanced Concepts', time: '1 day ago', progress: 'completed' },
    { type: 'badge', title: 'Earned "Quiz Master" badge', time: '3 days ago', reward: '+50 XP' },
    { type: 'interview', title: 'Mock Interview Session', time: '1 week ago', feedback: 'Great improvement!' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} p-6 rounded-xl border border-opacity-20 dark:border-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Progress</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>

          <div className="space-y-4">
            {[
              { label: 'Overall Progress', value: '68%', bar: 'from-blue-500 to-purple-600', width: '68%' },
              { label: 'Skill Development', value: '45%', bar: 'from-green-500 to-teal-600', width: '45%' },
              { label: 'Quiz Performance', value: '82%', bar: 'from-yellow-500 to-orange-600', width: '82%' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${item.bar} h-3 rounded-full`}
                    style={{ width: item.width }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div
                  className={`p-2 rounded-full ${
                    activity.type === 'quiz'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                      : activity.type === 'module'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                      : activity.type === 'badge'
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                  }`}
                >
                  {activity.type === 'quiz' && <Brain className="w-4 h-4" />}
                  {activity.type === 'module' && <BookOpen className="w-4 h-4" />}
                  {activity.type === 'badge' && <Award className="w-4 h-4" />}
                  {activity.type === 'interview' && <Target className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  {activity.score && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                      Score: {activity.score}
                    </span>
                  )}
                  {activity.reward && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                      {activity.reward}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all group">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Take Skill Assessment</p>
          </button>

          <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-all group">
            <Brain className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-green-700 dark:text-green-300">Start Adaptive Quiz</p>
          </button>

          <button className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900 transition-all group">
            <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Continue Learning</p>
          </button>
        </div>
      </div>
    </div>
  );
}
