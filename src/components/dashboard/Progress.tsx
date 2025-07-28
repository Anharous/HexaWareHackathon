import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  TrendingUp,
  Award,
  Target,
  Calendar,
  BookOpen,
  Brain,
  Star,
  Download
} from 'lucide-react';

export default function Progress() {
  const { user } = useAuth();
  const { quizzes, learningModules } = useData();

  const completedQuizzes = quizzes.filter(q => q.completed);
  const completedModules = learningModules.filter(m => m.completed);

  const weeklyProgress = [
    { week: 'Week 1', xp: 150, modules: 2, quizzes: 1 },
    { week: 'Week 2', xp: 300, modules: 3, quizzes: 2 },
    { week: 'Week 3', xp: 450, modules: 4, quizzes: 2 },
    { week: 'Week 4', xp: 600, modules: 5, quizzes: 3 },
  ];

  const skillProgress = [
    { skill: 'JavaScript', current: 85, target: 95, change: '+15%' },
    { skill: 'React', current: 90, target: 95, change: '+20%' },
    { skill: 'Python', current: 65, target: 85, change: '+30%' },
    { skill: 'System Design', current: 40, target: 75, change: '+40%' },
    { skill: 'Docker', current: 30, target: 70, change: '+30%' },
  ];

  const achievements = [
    { name: 'First Steps', description: 'Completed your first learning module', icon: '🚀', earned: true, date: '2024-01-15' },
    { name: 'Quiz Master', description: 'Scored 90%+ on 3 consecutive quizzes', icon: '🧠', earned: true, date: '2024-01-22' },
    { name: 'Streak Keeper', description: 'Maintained 7-day learning streak', icon: '🔥', earned: false, date: null },
    { name: 'Skill Specialist', description: 'Mastered a complete skill track', icon: '⭐', earned: false, date: null },
    { name: 'Interview Pro', description: 'Completed 5 mock interviews', icon: '🎯', earned: false, date: null },
    { name: 'Level Up', description: 'Reached Level 5', icon: '🏆', earned: false, date: null },
  ];

  const generateCertificate = () => {
    alert('Certificate generated! In a real app, this would download a PDF certificate.');
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Learning Progress</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your journey and celebrate achievements</p>
        </div>
        <button
          onClick={generateCertificate}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Certificate</span>
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Current Level</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-white mt-2">{user?.level || 1}</p>
            </div>
            <Award className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Total XP</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-white mt-2">{user?.xp || 0}</p>
            </div>
            <Star className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-xl border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Modules Done</p>
              <p className="text-3xl font-bold text-green-900 dark:text-white mt-2">{completedModules.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Quizzes Done</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-white mt-2">{completedQuizzes.length}</p>
            </div>
            <Brain className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Progress</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {weeklyProgress.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{week.week}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{week.modules} modules • {week.quizzes} quizzes</p>
                </div>
                <p className="font-bold text-blue-600">+{week.xp} XP</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Progress */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skill Development</h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {skillProgress.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{skill.skill}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600">{skill.change}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{skill.current}% / {skill.target}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full relative"
                    style={{ width: `${(skill.current / skill.target) * 100}%` }}
                  >
                    <div className="absolute right-0 top-0 w-1 h-3 bg-white dark:bg-gray-200 rounded-full opacity-50"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements & Badges</h3>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${achievement.earned ? 'text-yellow-800 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-sm ${achievement.earned ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Streaks */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Current Learning Streak</h3>
            <p className="text-orange-100">Keep the momentum going!</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-3xl font-bold">5 Days</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  day <= 5
                    ? 'bg-yellow-400 text-orange-800'
                    : 'bg-orange-300 text-orange-600'
                }`}
              >
                {day <= 5 ? '✓' : day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
