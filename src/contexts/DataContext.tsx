import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Quiz {
  _id: string; // <-- added for MongoDB support
  id: string;
  title: string;
  role: string;
  skills: string[];
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct: number;
    difficulty: 'easy' | 'medium' | 'hard';
    skill: string;
  }>;
  timeLimit: number;
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
  getRelevantQuizzes: (role: string, skills: string[]) => Quiz[];
  userStats: UserStats | null;
  activities: Activity[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch('/api/quizzes');
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      }
    };

    fetchQuizzes();
  }, []);

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

  const updateQuizScore = async (quizId: string, score: number) => {
  // 1. Update local state immediately (for responsiveness)
  setQuizzes(prev =>
    prev.map(quiz =>
      quiz._id === quizId ? { ...quiz, completed: true, score } : quiz
    )
  );

  // 2. Persist to MongoDB via backend API
  try {
    await fetch(`http://localhost:4000/api/quizzes/${quizId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true, score }),
    });
  } catch (error) {
    console.error('Failed to update quiz score in database:', error);
  }
};


  const completeModule = (moduleId: string) => {
    setLearningModules(prev =>
      prev.map(module =>
        module.id === moduleId ? { ...module, completed: true } : module
      )
    );
  };

  const getRecommendedModules = (skills: string[]) => {
    return learningModules.filter(module =>
      userStats?.skillGaps.includes(module.skill) || skills.includes(module.skill)
    );
  };

  const getRelevantQuizzes = (role: string, skills: string[]) => {
    return quizzes.filter(quiz =>
      quiz.role === role && quiz.skills.some(skill => skills.includes(skill))
    );
  };

  return (
    <DataContext.Provider
      value={{
        quizzes,
        learningModules,
        skillGaps: userStats?.skillGaps || [],
        updateQuizScore,
        completeModule,
        getRecommendedModules,
        getRelevantQuizzes,
        userStats,
        activities
      }}
    >
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
