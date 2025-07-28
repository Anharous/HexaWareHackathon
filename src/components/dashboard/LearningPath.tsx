import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  BookOpen,
  Video,
  FileText,
  Code,
  CheckCircle,
  Lock,
  Star,
  Clock,
  Trophy,
  PlayCircle
} from 'lucide-react';

export default function LearningPath() {
  const { user, updateUser } = useAuth();
  const { learningModules, skillGaps, completeModule } = useData();
  const [selectedPath, setSelectedPath] = useState<'free' | 'premium'>('free');

  const handleCompleteModule = (moduleId: string, xpReward: number) => {
    completeModule(moduleId);
    updateUser({ 
      xp: (user?.xp || 0) + xpReward,
      level: Math.floor(((user?.xp || 0) + xpReward) / 1000) + 1
    });
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'practice': return Code;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
    }
  };

  const learningPaths = {
    free: {
      title: 'Free Learning Path',
      description: 'Access to basic courses and tutorials',
      features: ['Basic video tutorials', 'Community support', 'Basic certificates'],
      modules: learningModules.slice(0, 3)
    },
    premium: {
      title: 'Premium Learning Path',
      description: 'Complete access to all premium content',
      features: ['HD video courses', 'Personal mentor', 'Industry certificates', 'Live sessions'],
      modules: learningModules
    }
  };

  const currentPath = learningPaths[selectedPath];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Path</h2>
          <p className="text-gray-600 dark:text-gray-400">Personalized roadmap based on your skill gaps</p>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Complete modules to earn XP and level up!
          </span>
        </div>
      </div>

      {/* Path Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(learningPaths).map(([key, path]) => (
          <div
            key={key}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPath === key
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:bg-gray-800 dark:border-gray-600'
            }`}
            onClick={() => setSelectedPath(key as 'free' | 'premium')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{path.title}</h3>
              {key === 'premium' && (
                <Star className="w-6 h-6 text-yellow-500" />
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{path.description}</p>
            <ul className="space-y-2">
              {path.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Learning Progress Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.level || 1}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.xp || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">XP Points</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentPath.modules.filter(m => m.completed).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentPath.modules.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Modules</p>
          </div>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentPath.title} Modules
        </h3>

        {currentPath.modules.map((module, index) => {
          const IconComponent = getModuleIcon(module.type);
          const isLocked = selectedPath === 'free' && index > 2;
          const isCompleted = module.completed;

          return (
            <div
              key={module.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border transition-all ${
                isLocked 
                  ? 'border-gray-200 dark:border-gray-700 opacity-60' 
                  : isCompleted
                  ? 'border-green-200 dark:border-green-500 bg-green-50 dark:bg-green-900'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isCompleted 
                    ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300'
                    : isLocked
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400'
                }`}>
                  {isLocked ? <Lock className="w-6 h-6" /> : <IconComponent className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {module.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{module.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>+{module.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {isCompleted ? (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-300">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      ) : isLocked ? (
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium">
                          Upgrade to Premium
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCompleteModule(module.id, module.xpReward)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Start Module</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next XP Goal */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Next Level Progress</h3>
            <p className="text-purple-100">
              {user?.xp || 0} / {((user?.level || 1) * 1000)} XP to Level {(user?.level || 1) + 1}
            </p>
          </div>
          <Trophy className="w-12 h-12 text-yellow-300" />
        </div>
        <div className="mt-4">
          <div className="bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(((user?.xp || 0) % 1000) / 1000 * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
