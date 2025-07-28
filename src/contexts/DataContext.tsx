import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Quiz {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct: number;
    difficulty: 'easy' | 'medium' | 'hard';
    skill: string;
  }>;
  completed: boolean;
  score?: number;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  skill: string;
  difficulty: string;
  duration: string;
  type: 'video' | 'article' | 'practice';
  url: string;
  completed: boolean;
  xpReward: number;
}

interface UserStats {
  xp: number;
  level: number;
  skillGaps: string[];
  completedModules: number;
  completedQuizzes: number;
}

interface Activity {
  type: 'quiz' | 'module' | 'badge' | 'interview';
  title: string;
  time: string;
  details?: {
    score?: number;
    reward?: string;
    feedback?: string;
  };
}

interface DataContextType {
  quizzes: Quiz[];
  learningModules: LearningModule[];
  skillGaps: string[];
  updateQuizScore: (quizId: string, score: number) => void;
  completeModule: (moduleId: string) => void;
  getRecommendedModules: (skills: string[]) => LearningModule[];
  userStats: UserStats | null;
  activities: Activity[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([/* default quizzes omitted for brevity */]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([/* default modules omitted for brevity */]);

  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        const statsRes = await fetch(`/api/overview/${user._id}/stats`);
        const statsData = await statsRes.json();
        setUserStats({
          xp: statsData.xp,
          level: statsData.level,
          skillGaps: statsData.skillGaps || [],
          completedModules: statsData.completedModules,
          completedQuizzes: statsData.completedQuizzes
        });

        const activityRes = await fetch(`/api/overview/${user._id}/activities`);
        const activityData = await activityRes.json();
        setActivities(activityData);
      } catch (err) {
        console.error('Failed to fetch overview data:', err);
      }
    };

    fetchData();
  }, [user]);

  const updateQuizScore = (quizId: string, score: number) => {
    setQuizzes(prev => prev.map(quiz =>
      quiz.id === quizId ? { ...quiz, completed: true, score } : quiz
    ));
  };

  const completeModule = (moduleId: string) => {
    setLearningModules(prev => prev.map(module =>
      module.id === moduleId ? { ...module, completed: true } : module
    ));
  };

  const getRecommendedModules = (skills: string[]) => {
    return learningModules.filter(module =>
      userStats?.skillGaps.includes(module.skill) || skills.includes(module.skill)
    );
  };

  return (
    <DataContext.Provider value={{
      quizzes,
      learningModules,
      skillGaps: userStats?.skillGaps || [],
      updateQuizScore,
      completeModule,
      getRecommendedModules,
      userStats,
      activities
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}