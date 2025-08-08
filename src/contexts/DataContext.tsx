//DataContext

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'http://localhost:4001'; 

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

// New Roadmap Node Interface
interface RoadmapNode {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'project' | 'assessment' | 'milestone';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  duration: string;
  completed: boolean;
  locked: boolean;
  prerequisite?: string[];
  position: { x: number; y: number };
  description: string;
  skills: string[];
  moduleId?: string; // Link to actual learning module
  quizId?: string; // Link to actual quiz
}

// New Roadmap Interface
interface LearningRoadmap {
  id: string;
  role: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
  totalXP: number;
  estimatedDuration: string;
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

// New Analysis Result Interface
interface AnalysisResult {
  required_skills: string[];
  current_skills: string[];
  missing_skills: string[];
  skill_match: string[];
  skill_categories: {
    name: string;
    color: string;
    skills: string[];
  }[];
  motivation: string;
  desired_role: string;
}

interface DataContextType {
  quizzes: Quiz[];
  learningModules: LearningModule[];
  skillGaps: string[];
  roadmaps: LearningRoadmap[];
  currentRoadmap: LearningRoadmap | null;
  analysisResult: AnalysisResult | null;
  updateQuizScore: (quizId: string, score: number) => void;
  completeModule: (moduleId: string) => void;
  completeRoadmapNode: (nodeId: string) => void;
  generateRoadmapForRole: (role: string, skillGaps: string[]) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  getRecommendedModules: (skills: string[]) => LearningModule[];
  getRelevantQuizzes: (role: string, skills: string[]) => Quiz[];
  userStats: UserStats | null;
  activities: Activity[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const [currentRoadmap, setCurrentRoadmap] = useState<LearningRoadmap | null>(null);
  const [analysisResult, setAnalysisResultState] = useState<AnalysisResult | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  const { user } = useAuth();
  
  
  // Initialize default learning modules
  useEffect(() => {
    const defaultModules: LearningModule[] = [
      // Frontend Modules
      {
        id: 'html-fundamentals',
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of web pages',
        skill: 'HTML',
        difficulty: 'beginner',
        duration: '2 hours',
        type: 'video',
        url: 'https://example.com/html-course',
        completed: false,
        xpReward: 100
      },
      {
        id: 'css-styling',
        title: 'CSS Styling & Layout',
        description: 'Master styling and responsive layouts',
        skill: 'CSS',
        difficulty: 'beginner',
        duration: '3 hours',
        type: 'video',
        url: 'https://example.com/css-course',
        completed: false,
        xpReward: 150
      },
      {
        id: 'javascript-basics',
        title: 'JavaScript Programming',
        description: 'Learn programming with JavaScript',
        skill: 'JavaScript',
        difficulty: 'intermediate',
        duration: '4 hours',
        type: 'video',
        url: 'https://example.com/js-course',
        completed: false,
        xpReward: 200
      },
      {
        id: 'react-fundamentals',
        title: 'React.js Fundamentals',
        description: 'Build dynamic UIs with React',
        skill: 'React',
        difficulty: 'intermediate',
        duration: '5 hours',
        type: 'video',
        url: 'https://example.com/react-course',
        completed: false,
        xpReward: 250
      },
      // Backend Modules
      {
        id: 'nodejs-basics',
        title: 'Node.js Fundamentals',
        description: 'Server-side JavaScript development',
        skill: 'Node.js',
        difficulty: 'intermediate',
        duration: '4 hours',
        type: 'video',
        url: 'https://example.com/nodejs-course',
        completed: false,
        xpReward: 180
      },
      {
        id: 'express-framework',
        title: 'Express.js Framework',
        description: 'Build REST APIs with Express',
        skill: 'Express.js',
        difficulty: 'intermediate',
        duration: '4 hours',
        type: 'video',
        url: 'https://example.com/express-course',
        completed: false,
        xpReward: 200
      },
      {
        id: 'mongodb-basics',
        title: 'MongoDB Database',
        description: 'NoSQL database fundamentals',
        skill: 'MongoDB',
        difficulty: 'intermediate',
        duration: '3 hours',
        type: 'video',
        url: 'https://example.com/mongodb-course',
        completed: false,
        xpReward: 160
      }
    ];

    setLearningModules(defaultModules);
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
       try {
      const res = await fetch(`${API_BASE_URL}/api/quizzes`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
        // Set empty array as fallback to prevent app crash
        setQuizzes([]);
      }
    };

    fetchQuizzes();
  }, []);

  // Fixed: Use correct API base URL and add error handling
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        // Fetch user stats
        const statsRes = await fetch(`${API_BASE_URL}/api/overview/${user._id}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setUserStats({
            xp: statsData.xp || 0,
            level: statsData.level || 1,
            skillGaps: statsData.skillGaps || [],
            completedModules: statsData.completedModules || 0,
            completedQuizzes: statsData.completedQuizzes || 0
          });
        } else {
          console.warn('Failed to fetch user stats, using defaults');
          setUserStats({
            xp: 0,
            level: 1,
            skillGaps: [],
            completedModules: 0,
            completedQuizzes: 0
          });
        }

        // Fetch activities
        const activityRes = await fetch(`${API_BASE_URL}/api/overview/${user._id}/activities`);
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActivities(activityData);
        } else {
          console.warn('Failed to fetch activities, using empty array');
          setActivities([]);
        }
      } catch (err) {
        console.error('Failed to fetch overview data:', err);
        // Set defaults to prevent app crash
        setUserStats({
          xp: 0,
          level: 1,
          skillGaps: [],
          completedModules: 0,
          completedQuizzes: 0
        });
        setActivities([]);
      }
    };

    fetchData();
  }, [user]);

  // Generate roadmap based on role and skill gaps
  const generateRoadmapForRole = (role: string, skillGaps: string[] = []) => {
    const roadmapTemplates: Record<string, Omit<LearningRoadmap, 'id'>> = {
      'Frontend Developer': {
        role: 'Frontend Developer',
        title: 'Frontend Development Mastery',
        description: 'Complete roadmap to become a skilled frontend developer',
        totalXP: 2000,
        estimatedDuration: '3-4 months',
        nodes: [
          {
            id: 'html-basics',
            title: 'HTML Fundamentals',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 100,
            duration: '2 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Learn the building blocks of web pages',
            skills: ['HTML', 'Semantic HTML', 'Forms'],
            moduleId: 'html-fundamentals'
          },
          {
            id: 'css-styling',
            title: 'CSS Styling',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 150,
            duration: '3 hours',
            completed: false,
            locked: true,
            prerequisite: ['html-basics'],
            position: { x: 25, y: 25 },
            description: 'Master styling and layouts',
            skills: ['CSS', 'Flexbox', 'Grid'],
            moduleId: 'css-styling'
          },
          {
            id: 'js-fundamentals',
            title: 'JavaScript Basics',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['css-styling'],
            position: { x: 75, y: 25 },
            description: 'Learn programming with JavaScript',
            skills: ['JavaScript', 'DOM', 'Events'],
            moduleId: 'javascript-basics'
          },
          {
            id: 'html-css-quiz',
            title: 'HTML/CSS Challenge',
            type: 'quiz',
            difficulty: 'beginner',
            xpReward: 75,
            duration: '30 min',
            completed: false,
            locked: true,
            prerequisite: ['css-styling'],
            position: { x: 10, y: 40 },
            description: 'Test your HTML and CSS knowledge',
            skills: ['HTML', 'CSS']
          },
          {
            id: 'react-intro',
            title: 'React Introduction',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 250,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['js-fundamentals'],
            position: { x: 50, y: 40 },
            description: 'Build dynamic UIs with React',
            skills: ['React', 'JSX', 'Components'],
            moduleId: 'react-fundamentals'
          },
          {
            id: 'portfolio-project',
            title: 'Portfolio Website',
            type: 'project',
            difficulty: 'intermediate',
            xpReward: 300,
            duration: '1 week',
            completed: false,
            locked: true,
            prerequisite: ['react-intro'],
            position: { x: 90, y: 40 },
            description: 'Build your personal portfolio',
            skills: ['HTML', 'CSS', 'JavaScript', 'React']
          },
          {
            id: 'state-management',
            title: 'State Management',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 200,
            duration: '3 hours',
            completed: false,
            locked: true,
            prerequisite: ['react-intro'],
            position: { x: 25, y: 55 },
            description: 'Master React state and hooks',
            skills: ['React Hooks', 'State', 'Context']
          },
          {
            id: 'api-integration',
            title: 'API Integration',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 220,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['state-management'],
            position: { x: 75, y: 55 },
            description: 'Connect to external APIs',
            skills: ['REST API', 'Fetch', 'Async/Await']
          },
          {
            id: 'final-assessment',
            title: 'Frontend Mastery',
            type: 'assessment',
            difficulty: 'advanced',
            xpReward: 500,
            duration: '2 hours',
            completed: false,
            locked: true,
            prerequisite: ['api-integration', 'portfolio-project'],
            position: { x: 50, y: 70 },
            description: 'Comprehensive frontend assessment',
            skills: ['HTML', 'CSS', 'JavaScript', 'React']
          },
          {
            id: 'milestone-junior',
            title: 'Junior Developer',
            type: 'milestone',
            difficulty: 'intermediate',
            xpReward: 1000,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['final-assessment'],
            position: { x: 50, y: 85 },
            description: 'Congratulations! You\'re ready for junior roles',
            skills: ['All Frontend Skills']
          }
        ]
      },
      'Backend Developer': {
        role: 'Backend Developer',
        title: 'Backend Development Mastery',
        description: 'Complete roadmap to become a skilled backend developer',
        totalXP: 2200,
        estimatedDuration: '3-4 months',
        nodes: [
          {
            id: 'server-basics',
            title: 'Server Fundamentals',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 120,
            duration: '3 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Understand how servers work',
            skills: ['HTTP', 'Servers', 'Client-Server']
          },
          {
            id: 'nodejs-intro',
            title: 'Node.js Basics',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 180,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['server-basics'],
            position: { x: 30, y: 25 },
            description: 'Build server-side applications',
            skills: ['Node.js', 'npm', 'Modules'],
            moduleId: 'nodejs-basics'
          },
          {
            id: 'database-intro',
            title: 'Database Fundamentals',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 160,
            duration: '3 hours',
            completed: false,
            locked: true,
            prerequisite: ['server-basics'],
            position: { x: 70, y: 25 },
            description: 'Learn data storage concepts',
            skills: ['SQL', 'NoSQL', 'Database Design']
          },
          {
            id: 'express-framework',
            title: 'Express.js Framework',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['nodejs-intro'],
            position: { x: 15, y: 40 },
            description: 'Build REST APIs with Express',
            skills: ['Express.js', 'Routing', 'Middleware'],
            moduleId: 'express-framework'
          },
          {
            id: 'mongodb-integration',
            title: 'MongoDB Integration',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 220,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['database-intro'],
            position: { x: 85, y: 40 },
            description: 'Store and retrieve data with MongoDB',
            skills: ['MongoDB', 'Mongoose', 'CRUD Operations'],
            moduleId: 'mongodb-basics'
          },
          {
            id: 'api-project',
            title: 'REST API Project',
            type: 'project',
            difficulty: 'intermediate',
            xpReward: 350,
            duration: '1 week',
            completed: false,
            locked: true,
            prerequisite: ['express-framework', 'mongodb-integration'],
            position: { x: 50, y: 55 },
            description: 'Build a complete REST API',
            skills: ['Node.js', 'Express.js', 'MongoDB']
          },
          {
            id: 'auth-security',
            title: 'Authentication & Security',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 280,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['api-project'],
            position: { x: 25, y: 70 },
            description: 'Secure your applications',
            skills: ['JWT', 'OAuth', 'Security Best Practices']
          },
          {
            id: 'deployment',
            title: 'Deployment & DevOps',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 250,
            duration: '3 hours',
            completed: false,
            locked: true,
            prerequisite: ['api-project'],
            position: { x: 75, y: 70 },
            description: 'Deploy applications to production',
            skills: ['Docker', 'AWS', 'CI/CD']
          },
          {
            id: 'backend-milestone',
            title: 'Backend Master',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1200,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['auth-security', 'deployment'],
            position: { x: 50, y: 85 },
            description: 'Master of backend development!',
            skills: ['All Backend Skills']
          }
        ]
      },
      'Full Stack Developer': {
        role: 'Full Stack Developer',
        title: 'Full Stack Development Mastery',
        description: 'Complete roadmap covering both frontend and backend',
        totalXP: 3500,
        estimatedDuration: '5-6 months',
        nodes: [
          // Combined frontend + backend nodes with additional full-stack specific content
          {
            id: 'web-fundamentals',
            title: 'Web Development Basics',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 150,
            duration: '4 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 5 },
            description: 'Understanding web architecture',
            skills: ['HTTP', 'Web Architecture', 'Client-Server']
          },
          // Add more full-stack specific nodes...
        ]
      }
    };

    const template = roadmapTemplates[role];
    if (!template) return;

    // Customize roadmap based on skill gaps
    const customizedNodes = template.nodes.map(node => {
      // If user already has the skills, mark as completed or unlock early
      const hasRequiredSkills = node.skills.every(skill => 
        !skillGaps.includes(skill.toLowerCase())
      );
      
      return {
        ...node,
        // Potentially unlock nodes if user already has prerequisite skills
        locked: hasRequiredSkills ? false : node.locked
      };
    });

    const newRoadmap: LearningRoadmap = {
      ...template,
      id: `${role.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      nodes: customizedNodes
    };

    setRoadmaps(prev => [newRoadmap, ...prev]);
    setCurrentRoadmap(newRoadmap);
  };

  const updateQuizScore = async (quizId: string, score: number) => {
    // Update local state immediately (for responsiveness)
    setQuizzes(prev =>
      prev.map(quiz =>
        quiz._id === quizId ? { ...quiz, completed: true, score } : quiz
      )
    );

    // Persist to MongoDB via backend API
    try {
       const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true, score }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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

    // Also update roadmap if this module is part of current roadmap
    if (currentRoadmap) {
      setCurrentRoadmap(prev => {
        if (!prev) return prev;
        
        const updatedNodes = prev.nodes.map(node => {
          if (node.moduleId === moduleId) {
            return { ...node, completed: true };
          }
          // Check if this completion unlocks other nodes
          if (node.prerequisite?.includes(moduleId)) {
            const allPrerequisitesMet = node.prerequisite.every(prereqId => {
              const prereqNode = prev.nodes.find(n => n.id === prereqId);
              return prereqNode?.completed || prereqId === moduleId;
            });
            if (allPrerequisitesMet) {
              return { ...node, locked: false };
            }
          }
          return node;
        });

        return { ...prev, nodes: updatedNodes };
      });
    }
  };

  const completeRoadmapNode = (nodeId: string) => {
    if (!currentRoadmap) return;

    setCurrentRoadmap(prev => {
      if (!prev) return prev;

      const updatedNodes = prev.nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, completed: true };
        }
        // Unlock next nodes
        if (node.prerequisite?.includes(nodeId)) {
          const allPrerequisitesMet = node.prerequisite.every(prereqId => {
            const prereqNode = prev.nodes.find(n => n.id === prereqId);
            return prereqNode?.completed || prereqId === nodeId;
          });
          if (allPrerequisitesMet) {
            return { ...node, locked: false };
          }
        }
        return node;
      });

      return { ...prev, nodes: updatedNodes };
    });

    // Add activity log
    const completedNode = currentRoadmap.nodes.find(n => n.id === nodeId);
    if (completedNode) {
      setActivities(prev => [{
        type: completedNode.type === 'quiz' ? 'quiz' : 'module',
        title: `Completed ${completedNode.title}`,
        time: new Date().toISOString(),
        details: {
          reward: `+${completedNode.xpReward} XP`
        }
      }, ...prev.slice(0, 9)]); // Keep only last 10 activities
    }
  };

  const setAnalysisResult = (result: AnalysisResult) => {
    setAnalysisResultState(result);
    
    // Auto-generate roadmap when analysis is complete
    if (result.desired_role && result.missing_skills) {
      generateRoadmapForRole(result.desired_role, result.missing_skills);
    }
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
        roadmaps,
        currentRoadmap,
        analysisResult,
        updateQuizScore,
        completeModule,
        completeRoadmapNode,
        generateRoadmapForRole,
        setAnalysisResult,
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