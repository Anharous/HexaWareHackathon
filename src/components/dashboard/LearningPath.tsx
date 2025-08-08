import React, { useState, useEffect } from 'react';
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
  PlayCircle,
  Brain,
  Target,
  Award,
  Zap,
  Users,
  GitBranch,
  ExternalLink
} from 'lucide-react';

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
  courseLinks?: { platform: string; url: string; title: string }[];
}

export default function LearningPath() {
  const { user, updateUser } = useAuth();
  const { analysisResult } = useData();
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapNode[]>([]);

  // Generate roadmap based on desired role
  useEffect(() => {
    const generateRoadmap = (role: string, missingSkills: string[] = []) => {
      const roadmaps: Record<string, RoadmapNode[]> = {
        'Frontend Developer': [
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
            courseLinks: [
              { platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', title: 'Responsive Web Design Certification' },
              { platform: 'Codecademy', url: 'https://www.codecademy.com/learn/learn-html', title: 'Learn HTML' },
              { platform: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', title: 'HTML Learning Path' }
            ]
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
            courseLinks: [
              { platform: 'CSS-Tricks', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', title: 'Complete Guide to Flexbox' },
              { platform: 'Grid Garden', url: 'https://cssgridgarden.com/', title: 'CSS Grid Game' },
              { platform: 'Codecademy', url: 'https://www.codecademy.com/learn/learn-css', title: 'Learn CSS' }
            ]
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
            courseLinks: [
              { platform: 'JavaScript.info', url: 'https://javascript.info/', title: 'The Modern JavaScript Tutorial' },
              { platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', title: 'JavaScript Algorithms and Data Structures' },
              { platform: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net/', title: 'Eloquent JavaScript Book' }
            ]
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
            skills: ['HTML', 'CSS'],
            courseLinks: [
              { platform: 'W3Schools', url: 'https://www.w3schools.com/quiztest/', title: 'HTML & CSS Quiz' },
              { platform: 'Codepen', url: 'https://codepen.io/challenges', title: 'Frontend Challenges' }
            ]
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
            courseLinks: [
              { platform: 'React.dev', url: 'https://react.dev/learn', title: 'Official React Tutorial' },
              { platform: 'Scrimba', url: 'https://scrimba.com/learn/learnreact', title: 'Learn React for Free' },
              { platform: 'Egghead', url: 'https://egghead.io/courses/the-beginner-s-guide-to-react', title: 'Beginner\'s Guide to React' }
            ]
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
            skills: ['HTML', 'CSS', 'JavaScript', 'React'],
            courseLinks: [
              { platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=react+portfolio+tutorial', title: 'React Portfolio Tutorials' },
              { platform: 'GitHub', url: 'https://github.com/topics/portfolio-website', title: 'Portfolio Examples' }
            ]
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
            skills: ['React Hooks', 'State', 'Context'],
            courseLinks: [
              { platform: 'React.dev', url: 'https://react.dev/reference/react', title: 'React Hooks Reference' },
              { platform: 'Udemy', url: 'https://www.udemy.com/topic/react-hooks/', title: 'React Hooks Courses' }
            ]
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
            skills: ['REST API', 'Fetch', 'Async/Await'],
            courseLinks: [
              { platform: 'JSONPlaceholder', url: 'https://jsonplaceholder.typicode.com/', title: 'Free API for Testing' },
              { platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/how-to-consume-rest-apis-in-react/', title: 'REST APIs in React' }
            ]
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
        ],
        'Backend Developer': [
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
            skills: ['HTTP', 'Servers', 'Client-Server'],
            courseLinks: [
              { platform: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', title: 'HTTP Documentation' },
              { platform: 'Coursera', url: 'https://www.coursera.org/learn/server-side-development', title: 'Server-side Development' }
            ]
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
            courseLinks: [
              { platform: 'Node.js', url: 'https://nodejs.org/en/learn/', title: 'Official Node.js Guide' },
              { platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', title: 'Backend Development and APIs' },
              { platform: 'Codecademy', url: 'https://www.codecademy.com/learn/learn-node-js', title: 'Learn Node.js' }
            ]
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
            skills: ['SQL', 'NoSQL', 'Database Design'],
            courseLinks: [
              { platform: 'W3Schools', url: 'https://www.w3schools.com/sql/', title: 'SQL Tutorial' },
              { platform: 'MongoDB University', url: 'https://university.mongodb.com/', title: 'MongoDB Courses' },
              { platform: 'SQLBolt', url: 'https://sqlbolt.com/', title: 'Interactive SQL Lessons' }
            ]
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
            courseLinks: [
              { platform: 'Express.js', url: 'https://expressjs.com/en/starter/installing.html', title: 'Official Express Guide' },
              { platform: 'The Odin Project', url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs', title: 'NodeJS Course' }
            ]
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
            courseLinks: [
              { platform: 'MongoDB', url: 'https://www.mongodb.com/developer/languages/javascript/', title: 'MongoDB with Node.js' },
              { platform: 'Mongoose', url: 'https://mongoosejs.com/docs/guide.html', title: 'Mongoose Documentation' }
            ]
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
            skills: ['Node.js', 'Express.js', 'MongoDB'],
            courseLinks: [
              { platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=node+express+mongodb+rest+api+tutorial', title: 'REST API Tutorials' },
              { platform: 'GitHub', url: 'https://github.com/topics/rest-api', title: 'REST API Examples' }
            ]
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
            skills: ['JWT', 'OAuth', 'Security Best Practices'],
            courseLinks: [
              { platform: 'Auth0', url: 'https://auth0.com/docs', title: 'Authentication Documentation' },
              { platform: 'OWASP', url: 'https://owasp.org/www-project-top-ten/', title: 'Security Best Practices' }
            ]
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
            skills: ['Docker', 'AWS', 'CI/CD'],
            courseLinks: [
              { platform: 'Docker', url: 'https://docs.docker.com/get-started/', title: 'Docker Get Started' },
              { platform: 'AWS', url: 'https://aws.amazon.com/getting-started/', title: 'AWS Getting Started' },
              { platform: 'Heroku', url: 'https://devcenter.heroku.com/articles/getting-started-with-nodejs', title: 'Deploy Node.js on Heroku' }
            ]
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
        ],
        'Full Stack Developer': [
          {
            id: 'web-fundamentals',
            title: 'Web Development Fundamentals',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 150,
            duration: '4 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Learn HTML, CSS, and JavaScript basics',
            skills: ['HTML', 'CSS', 'JavaScript'],
            courseLinks: [
              { platform: 'The Odin Project', url: 'https://www.theodinproject.com/paths/foundations/courses/foundations', title: 'Web Development Foundations' },
              { platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/', title: 'Full Stack Development' }
            ]
          },
          {
            id: 'frontend-framework',
            title: 'Frontend Framework',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['web-fundamentals'],
            position: { x: 25, y: 30 },
            description: 'Master React or Vue.js',
            skills: ['React', 'Vue.js', 'State Management'],
            courseLinks: [
              { platform: 'React.dev', url: 'https://react.dev/', title: 'React Documentation' },
              { platform: 'Vue.js', url: 'https://vuejs.org/guide/', title: 'Vue.js Guide' }
            ]
          },
          {
            id: 'backend-basics',
            title: 'Backend Development',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 220,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['web-fundamentals'],
            position: { x: 75, y: 30 },
            description: 'Learn Node.js and Express',
            skills: ['Node.js', 'Express.js', 'APIs'],
            courseLinks: [
              { platform: 'Node.js', url: 'https://nodejs.org/en/learn/', title: 'Node.js Learning' },
              { platform: 'Express.js', url: 'https://expressjs.com/', title: 'Express Documentation' }
            ]
          },
          {
            id: 'database-management',
            title: 'Database Management',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 180,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['backend-basics'],
            position: { x: 50, y: 50 },
            description: 'Work with databases effectively',
            skills: ['SQL', 'MongoDB', 'Database Design'],
            courseLinks: [
              { platform: 'PostgreSQL', url: 'https://www.postgresql.org/docs/current/tutorial.html', title: 'PostgreSQL Tutorial' },
              { platform: 'MongoDB University', url: 'https://university.mongodb.com/', title: 'MongoDB Learning' }
            ]
          },
          {
            id: 'fullstack-project',
            title: 'Full Stack Project',
            type: 'project',
            difficulty: 'advanced',
            xpReward: 400,
            duration: '2 weeks',
            completed: false,
            locked: true,
            prerequisite: ['frontend-framework', 'database-management'],
            position: { x: 50, y: 70 },
            description: 'Build a complete web application',
            skills: ['React', 'Node.js', 'Database', 'Deployment'],
            courseLinks: [
              { platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=full+stack+project+tutorial', title: 'Full Stack Tutorials' },
              { platform: 'GitHub', url: 'https://github.com/topics/full-stack', title: 'Full Stack Examples' }
            ]
          },
          {
            id: 'fullstack-milestone',
            title: 'Full Stack Master',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1500,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['fullstack-project'],
            position: { x: 50, y: 85 },
            description: 'You\'re now a full stack developer!',
            skills: ['All Full Stack Skills']
          }
        ],
        'Data Scientist': [
          {
            id: 'python-basics',
            title: 'Python Programming',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 120,
            duration: '5 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Learn Python programming fundamentals',
            skills: ['Python', 'Programming Logic', 'Data Types'],
            courseLinks: [
              { platform: 'Python.org', url: 'https://docs.python.org/3/tutorial/', title: 'Official Python Tutorial' },
              { platform: 'Codecademy', url: 'https://www.codecademy.com/learn/learn-python-3', title: 'Learn Python 3' },
              { platform: 'Real Python', url: 'https://realpython.com/', title: 'Python Tutorials' }
            ]
          },
          {
            id: 'data-analysis',
            title: 'Data Analysis with Pandas',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 180,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['python-basics'],
            position: { x: 30, y: 30 },
            description: 'Master data manipulation and analysis',
            skills: ['Pandas', 'NumPy', 'Data Cleaning'],
            courseLinks: [
              { platform: 'Pandas', url: 'https://pandas.pydata.org/docs/getting_started/index.html', title: 'Pandas Getting Started' },
              { platform: 'Kaggle', url: 'https://www.kaggle.com/learn/pandas', title: 'Pandas Course' }
            ]
          },
          {
            id: 'visualization',
            title: 'Data Visualization',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 160,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['data-analysis'],
            position: { x: 70, y: 30 },
            description: 'Create compelling visualizations',
            skills: ['Matplotlib', 'Seaborn', 'Plotly'],
            courseLinks: [
              { platform: 'Matplotlib', url: 'https://matplotlib.org/stable/tutorials/index.html', title: 'Matplotlib Tutorials' },
              { platform: 'Seaborn', url: 'https://seaborn.pydata.org/tutorial.html', title: 'Seaborn Tutorial' }
            ]
          },
          {
            id: 'statistics',
            title: 'Statistics & Probability',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '8 hours',
            completed: false,
            locked: true,
            prerequisite: ['data-analysis'],
            position: { x: 20, y: 50 },
            description: 'Master statistical concepts',
            skills: ['Statistics', 'Probability', 'Hypothesis Testing'],
            courseLinks: [
              { platform: 'Khan Academy', url: 'https://www.khanacademy.org/math/statistics-probability', title: 'Statistics and Probability' },
              { platform: 'Coursera', url: 'https://www.coursera.org/specializations/statistics', title: 'Statistics Specialization' }
            ]
          },
          {
            id: 'machine-learning',
            title: 'Machine Learning',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 300,
            duration: '10 hours',
            completed: false,
            locked: true,
            prerequisite: ['statistics', 'visualization'],
            position: { x: 80, y: 50 },
            description: 'Build predictive models',
            skills: ['Scikit-learn', 'ML Algorithms', 'Model Evaluation'],
            courseLinks: [
              { platform: 'Scikit-learn', url: 'https://scikit-learn.org/stable/tutorial/index.html', title: 'Scikit-learn Tutorial' },
              { platform: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning', title: 'Machine Learning Course' }
            ]
          },
          {
            id: 'data-science-project',
            title: 'Data Science Project',
            type: 'project',
            difficulty: 'advanced',
            xpReward: 400,
            duration: '2 weeks',
            completed: false,
            locked: true,
            prerequisite: ['machine-learning'],
            position: { x: 50, y: 70 },
            description: 'Complete end-to-end data science project',
            skills: ['Python', 'ML', 'Data Analysis', 'Visualization'],
            courseLinks: [
              { platform: 'Kaggle', url: 'https://www.kaggle.com/competitions', title: 'Data Science Competitions' },
              { platform: 'GitHub', url: 'https://github.com/topics/data-science', title: 'Data Science Projects' }
            ]
          },
          {
            id: 'data-scientist-milestone',
            title: 'Data Science Master',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1000,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['data-science-project'],
            position: { x: 50, y: 85 },
            description: 'You\'re now a skilled data scientist!',
            skills: ['All Data Science Skills']
          }
        ],
        'Mobile Developer': [
          {
            id: 'mobile-fundamentals',
            title: 'Mobile Development Basics',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 100,
            duration: '3 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Understand mobile platforms and app architecture',
            skills: ['Mobile Platforms', 'App Architecture', 'UI/UX Principles'],
            courseLinks: [
              { platform: 'Google Developers', url: 'https://developers.google.com/learn/pathways/mobile', title: 'Mobile Development Pathway' },
              { platform: 'Apple Developer', url: 'https://developer.apple.com/learn/', title: 'iOS Development Learning' }
            ]
          },
          {
            id: 'programming-language',
            title: 'Programming Language',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 150,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['mobile-fundamentals'],
            position: { x: 30, y: 25 },
            description: 'Master Kotlin/Swift or JavaScript for mobile',
            skills: ['Kotlin', 'Swift', 'JavaScript', 'Dart'],
            courseLinks: [
              { platform: 'Kotlinlang', url: 'https://kotlinlang.org/docs/getting-started.html', title: 'Kotlin Getting Started' },
              { platform: 'Swift.org', url: 'https://swift.org/getting-started/', title: 'Swift Programming Guide' },
              { platform: 'Dart.dev', url: 'https://dart.dev/tutorials', title: 'Dart Language Tutorial' }
            ]
          },
          {
            id: 'react-native',
            title: 'React Native',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['programming-language'],
            position: { x: 70, y: 25 },
            description: 'Build cross-platform apps with React Native',
            skills: ['React Native', 'Cross-platform', 'Navigation'],
            courseLinks: [
              { platform: 'React Native', url: 'https://reactnative.dev/docs/getting-started', title: 'React Native Docs' },
              { platform: 'Expo', url: 'https://docs.expo.dev/tutorial/introduction/', title: 'Expo Tutorial' }
            ]
          },
          {
            id: 'native-development',
            title: 'Native Development',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 250,
            duration: '8 hours',
            completed: false,
            locked: true,
            prerequisite: ['programming-language'],
            position: { x: 15, y: 40 },
            description: 'Build native Android/iOS applications',
            skills: ['Android Studio', 'Xcode', 'Native APIs'],
            courseLinks: [
              { platform: 'Android Developers', url: 'https://developer.android.com/courses', title: 'Android Development Courses' },
              { platform: 'Apple Developer', url: 'https://developer.apple.com/tutorials/swiftui', title: 'SwiftUI Tutorials' }
            ]
          },
          {
            id: 'flutter-development',
            title: 'Flutter Development',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 220,
            duration: '7 hours',
            completed: false,
            locked: true,
            prerequisite: ['programming-language'],
            position: { x: 85, y: 40 },
            description: 'Create beautiful cross-platform apps with Flutter',
            skills: ['Flutter', 'Dart', 'Widgets', 'State Management'],
            courseLinks: [
              { platform: 'Flutter.dev', url: 'https://docs.flutter.dev/get-started/codelab', title: 'Flutter Codelab' },
              { platform: 'Udacity', url: 'https://www.udacity.com/course/flutter-course', title: 'Flutter Course' }
            ]
          },
          {
            id: 'mobile-ui-ux',
            title: 'Mobile UI/UX Design',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 180,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['react-native', 'native-development', 'flutter-development'],
            position: { x: 50, y: 55 },
            description: 'Design beautiful and intuitive mobile interfaces',
            skills: ['Material Design', 'Human Interface Guidelines', 'Responsive Design'],
            courseLinks: [
              { platform: 'Material Design', url: 'https://m3.material.io/', title: 'Material Design 3' },
              { platform: 'Apple HIG', url: 'https://developer.apple.com/design/human-interface-guidelines/', title: 'Human Interface Guidelines' }
            ]
          },
          {
            id: 'mobile-app-project',
            title: 'Mobile App Project',
            type: 'project',
            difficulty: 'advanced',
            xpReward: 400,
            duration: '2 weeks',
            completed: false,
            locked: true,
            prerequisite: ['mobile-ui-ux'],
            position: { x: 30, y: 70 },
            description: 'Build and deploy a complete mobile application',
            skills: ['App Development', 'Testing', 'Deployment'],
            courseLinks: [
              { platform: 'Google Play Console', url: 'https://developer.android.com/distribute/console', title: 'Android App Publishing' },
              { platform: 'App Store Connect', url: 'https://developer.apple.com/app-store-connect/', title: 'iOS App Publishing' }
            ]
          },
          {
            id: 'mobile-performance',
            title: 'Performance Optimization',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 200,
            duration: '3 hours',
            completed: false,
            locked: true,
            prerequisite: ['mobile-app-project'],
            position: { x: 70, y: 70 },
            description: 'Optimize mobile app performance and user experience',
            skills: ['Performance Tuning', 'Memory Management', 'Battery Optimization'],
            courseLinks: [
              { platform: 'Android Performance', url: 'https://developer.android.com/training/best-performance', title: 'Android Performance Best Practices' },
              { platform: 'iOS Performance', url: 'https://developer.apple.com/documentation/xcode/improving_your_app_s_performance', title: 'iOS Performance Guidelines' }
            ]
          },
          {
            id: 'mobile-developer-milestone',
            title: 'Mobile Development Master',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1200,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['mobile-performance'],
            position: { x: 50, y: 85 },
            description: 'Expert mobile developer ready for any platform!',
            skills: ['All Mobile Development Skills']
          }
        ],
        'DevOps Engineer': [
          {
            id: 'linux-fundamentals',
            title: 'Linux Administration',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 120,
            duration: '4 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Master Linux command line and system administration',
            skills: ['Linux', 'Command Line', 'Shell Scripting'],
            courseLinks: [
              { platform: 'Linux Foundation', url: 'https://www.linuxfoundation.org/training', title: 'Linux Training' },
              { platform: 'OverTheWire', url: 'https://overthewire.org/wargames/', title: 'Linux Command Line Games' }
            ]
          },
          {
            id: 'version-control',
            title: 'Version Control with Git',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 100,
            duration: '3 hours',
            completed: false,
            locked: true,
            prerequisite: ['linux-fundamentals'],
            position: { x: 25, y: 25 },
            description: 'Master Git and collaborative development workflows',
            skills: ['Git', 'GitHub', 'Branching', 'Merging'],
            courseLinks: [
              { platform: 'Atlassian', url: 'https://www.atlassian.com/git/tutorials', title: 'Git Tutorials' },
              { platform: 'GitHub Skills', url: 'https://skills.github.com/', title: 'GitHub Learning Lab' }
            ]
          },
          {
            id: 'cloud-platforms',
            title: 'Cloud Platforms',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['version-control'],
            position: { x: 75, y: 25 },
            description: 'Learn AWS, Azure, or Google Cloud Platform',
            skills: ['AWS', 'Azure', 'GCP', 'Cloud Services'],
            courseLinks: [
              { platform: 'AWS Training', url: 'https://aws.amazon.com/training/', title: 'AWS Learning Center' },
              { platform: 'Azure Learn', url: 'https://learn.microsoft.com/en-us/azure/', title: 'Microsoft Azure Learning' },
              { platform: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google/', title: 'GCP Learning Path' }
            ]
          },
          {
            id: 'containerization',
            title: 'Docker & Containerization',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 180,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['cloud-platforms'],
            position: { x: 35, y: 40 },
            description: 'Package and deploy applications with Docker',
            skills: ['Docker', 'Containers', 'Image Management'],
            courseLinks: [
              { platform: 'Docker', url: 'https://docs.docker.com/get-started/', title: 'Docker Get Started' },
              { platform: 'Play with Docker', url: 'https://labs.play-with-docker.com/', title: 'Interactive Docker Learning' }
            ]
          },
          {
            id: 'orchestration',
            title: 'Kubernetes Orchestration',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 250,
            duration: '8 hours',
            completed: false,
            locked: true,
            prerequisite: ['containerization'],
            position: { x: 65, y: 40 },
            description: 'Orchestrate containers at scale with Kubernetes',
            skills: ['Kubernetes', 'Container Orchestration', 'Cluster Management'],
            courseLinks: [
              { platform: 'Kubernetes.io', url: 'https://kubernetes.io/docs/tutorials/', title: 'Kubernetes Tutorials' },
              { platform: 'Katacoda', url: 'https://www.katacoda.com/courses/kubernetes', title: 'Interactive K8s Learning' }
            ]
          },
          {
            id: 'ci-cd-pipelines',
            title: 'CI/CD Pipelines',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 220,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['version-control'],
            position: { x: 15, y: 55 },
            description: 'Automate testing and deployment workflows',
            skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Pipeline Automation'],
            courseLinks: [
              { platform: 'Jenkins.io', url: 'https://www.jenkins.io/doc/tutorials/', title: 'Jenkins Tutorials' },
              { platform: 'GitHub Actions', url: 'https://docs.github.com/en/actions/learn-github-actions', title: 'GitHub Actions Guide' }
            ]
          },
          {
            id: 'infrastructure-as-code',
            title: 'Infrastructure as Code',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 280,
            duration: '7 hours',
            completed: false,
            locked: true,
            prerequisite: ['orchestration', 'ci-cd-pipelines'],
            position: { x: 85, y: 55 },
            description: 'Manage infrastructure with Terraform and Ansible',
            skills: ['Terraform', 'Ansible', 'Infrastructure Automation'],
            courseLinks: [
              { platform: 'HashiCorp Learn', url: 'https://learn.hashicorp.com/terraform', title: 'Terraform Tutorials' },
              { platform: 'Ansible Docs', url: 'https://docs.ansible.com/ansible/latest/user_guide/index.html', title: 'Ansible User Guide' }
            ]
          },
          {
            id: 'monitoring-logging',
            title: 'Monitoring & Logging',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 200,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['infrastructure-as-code'],
            position: { x: 50, y: 70 },
            description: 'Implement comprehensive monitoring and logging solutions',
            skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Monitoring'],
            courseLinks: [
              { platform: 'Prometheus.io', url: 'https://prometheus.io/docs/introduction/overview/', title: 'Prometheus Documentation' },
              { platform: 'Grafana Tutorials', url: 'https://grafana.com/tutorials/', title: 'Grafana Learning' }
            ]
          },
          {
            id: 'devops-milestone',
            title: 'DevOps Master',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1300,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['monitoring-logging'],
            position: { x: 50, y: 85 },
            description: 'DevOps engineering expert ready for any infrastructure!',
            skills: ['All DevOps Skills']
          }
        ],
        'UI/UX Designer': [
          {
            id: 'design-fundamentals',
            title: 'Design Fundamentals',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 100,
            duration: '4 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Learn color theory, typography, and layout principles',
            skills: ['Color Theory', 'Typography', 'Layout', 'Visual Hierarchy'],
            courseLinks: [
              { platform: 'Coursera', url: 'https://www.coursera.org/learn/fundamentals-of-graphic-design', title: 'Fundamentals of Graphic Design' },
              { platform: 'Adobe', url: 'https://www.adobe.com/creativecloud/design/education.html', title: 'Adobe Design Education' }
            ]
          },
          {
            id: 'ux-research',
            title: 'User Experience Research',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 150,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['design-fundamentals'],
            position: { x: 25, y: 25 },
            description: 'Understand users through research and analysis',
            skills: ['User Research', 'Personas', 'User Journey Mapping', 'Analytics'],
            courseLinks: [
              { platform: 'Nielsen Norman Group', url: 'https://www.nngroup.com/courses/', title: 'UX Research Methods' },
              { platform: 'Google UX Design Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design', title: 'Google UX Design Program' }
            ]
          },
          {
            id: 'design-tools',
            title: 'Design Tools Mastery',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 120,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['design-fundamentals'],
            position: { x: 75, y: 25 },
            description: 'Master Figma, Adobe XD, and Sketch',
            skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
            courseLinks: [
              { platform: 'Figma Academy', url: 'https://www.figma.com/academy/', title: 'Figma Learning Resources' },
              { platform: 'Adobe XD Guru', url: 'https://xd.adobe.com/ideas/career-tips/ui-ux-designer-skills/', title: 'Adobe XD Tutorials' }
            ]
          },
          {
            id: 'wireframing-prototyping',
            title: 'Wireframing & Prototyping',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 180,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['ux-research', 'design-tools'],
            position: { x: 35, y: 40 },
            description: 'Create wireframes and interactive prototypes',
            skills: ['Wireframing', 'Prototyping', 'Information Architecture'],
            courseLinks: [
              { platform: 'IxDF', url: 'https://www.interaction-design.org/courses/prototyping', title: 'Prototyping Course' },
              { platform: 'UXPin', url: 'https://www.uxpin.com/studio/ebooks/', title: 'Prototyping Guide' }
            ]
          },
          {
            id: 'visual-design',
            title: 'Visual Design Systems',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['design-tools'],
            position: { x: 65, y: 40 },
            description: 'Create cohesive visual design systems',
            skills: ['Design Systems', 'Component Libraries', 'Brand Guidelines'],
            courseLinks: [
              { platform: 'Design Systems Handbook', url: 'https://www.designbetter.co/design-systems-handbook', title: 'Design Systems Guide' },
              { platform: 'Material Design', url: 'https://m3.material.io/', title: 'Material Design System' }
            ]
          },
          {
            id: 'usability-testing',
            title: 'Usability Testing',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 160,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['wireframing-prototyping'],
            position: { x: 20, y: 55 },
            description: 'Test and validate your design decisions',
            skills: ['Usability Testing', 'A/B Testing', 'User Feedback'],
            courseLinks: [
              { platform: 'UserTesting', url: 'https://www.usertesting.com/resources', title: 'Usability Testing Resources' },
              { platform: 'Maze', url: 'https://maze.co/guides/', title: 'User Testing Guide' }
            ]
          },
          {
            id: 'interaction-design',
            title: 'Interaction Design',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 220,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['visual-design'],
            position: { x: 80, y: 55 },
            description: 'Design engaging user interactions and animations',
            skills: ['Micro-interactions', 'Animation', 'Gesture Design'],
            courseLinks: [
              { platform: 'IxDF', url: 'https://www.interaction-design.org/courses/interaction-design', title: 'Interaction Design Course' },
              { platform: 'Principle', url: 'https://principleformac.com/tutorial.html', title: 'Animation for Designers' }
            ]
          },
          {
            id: 'design-portfolio',
            title: 'Design Portfolio Project',
            type: 'project',
            difficulty: 'advanced',
            xpReward: 350,
            duration: '2 weeks',
            completed: false,
            locked: true,
            prerequisite: ['usability-testing', 'interaction-design'],
            position: { x: 50, y: 70 },
            description: 'Create a comprehensive UX case study',
            skills: ['Case Study', 'Portfolio Design', 'Presentation'],
            courseLinks: [
              { platform: 'UXfolio', url: 'https://uxfolio.com/ux-portfolio-guide', title: 'UX Portfolio Guide' },
              { platform: 'Behance', url: 'https://www.behance.net/', title: 'Design Portfolio Examples' }
            ]
          },
          {
            id: 'ui-ux-milestone',
            title: 'UI/UX Design Master',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1100,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['design-portfolio'],
            position: { x: 50, y: 85 },
            description: 'Expert UI/UX designer ready for any challenge!',
            skills: ['All UI/UX Design Skills']
          }
        ],
        'Cybersecurity Analyst': [
          {
            id: 'security-fundamentals',
            title: 'Security Fundamentals',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 120,
            duration: '4 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Learn core cybersecurity concepts and principles',
            skills: ['Information Security', 'CIA Triad', 'Risk Assessment'],
            courseLinks: [
              { platform: 'SANS', url: 'https://www.sans.org/cyber-security-courses/', title: 'SANS Security Training' },
              { platform: 'Cybrary', url: 'https://www.cybrary.it/', title: 'Free Cybersecurity Training' }
            ]
          },
          {
            id: 'networking-security',
            title: 'Network Security',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 180,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['security-fundamentals'],
            position: { x: 25, y: 25 },
            description: 'Secure networks and understand network attacks',
            skills: ['Firewalls', 'VPNs', 'Network Protocols', 'Intrusion Detection'],
            courseLinks: [
              { platform: 'Cisco', url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna-security.html', title: 'CCNA Security' },
              { platform: 'CompTIA', url: 'https://www.comptia.org/certifications/network-plus', title: 'Network+ Certification' }
            ]
          },
          {
            id: 'ethical-hacking',
            title: 'Ethical Hacking',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '8 hours',
            completed: false,
            locked: true,
            prerequisite: ['networking-security'],
            position: { x: 75, y: 25 },
            description: 'Learn penetration testing and vulnerability assessment',
            skills: ['Penetration Testing', 'Vulnerability Assessment', 'OWASP'],
            courseLinks: [
              { platform: 'EC-Council', url: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/', title: 'Certified Ethical Hacker' },
              { platform: 'PortSwigger', url: 'https://portswigger.net/web-security', title: 'Web Security Academy' }
            ]
          },
          {
            id: 'incident-response',
            title: 'Incident Response',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 220,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['ethical-hacking'],
            position: { x: 35, y: 40 },
            description: 'Handle security incidents and digital forensics',
            skills: ['Incident Response', 'Digital Forensics', 'Malware Analysis'],
            courseLinks: [
              { platform: 'NIST', url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final', title: 'NIST Incident Response Guide' },
              { platform: 'SANS', url: 'https://www.sans.org/courses/incident-response/', title: 'SANS Incident Response' }
            ]
          },
          {
            id: 'security-tools',
            title: 'Security Tools & SIEM',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 250,
            duration: '7 hours',
            completed: false,
            locked: true,
            prerequisite: ['incident-response'],
            position: { x: 65, y: 40 },
            description: 'Master security tools and SIEM platforms',
            skills: ['SIEM', 'Splunk', 'Wireshark', 'Nmap', 'Metasploit'],
            courseLinks: [
              { platform: 'Splunk Education', url: 'https://education.splunk.com/', title: 'Splunk Training' },
              { platform: 'Wireshark University', url: 'https://www.wireshark.org/docs/', title: 'Wireshark Documentation' }
            ]
          },
          {
            id: 'compliance-governance',
            title: 'Compliance & Governance',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 180,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['security-tools'],
            position: { x: 50, y: 55 },
            description: 'Understand regulatory compliance and governance',
            skills: ['GDPR', 'HIPAA', 'SOX', 'ISO 27001', 'Risk Management'],
            courseLinks: [
              { platform: 'ISACA', url: 'https://www.isaca.org/training-and-events', title: 'ISACA Training' },
              { platform: 'ISO', url: 'https://www.iso.org/isoiec-27001-information-security.html', title: 'ISO 27001 Guide' }
            ]
          },
          {
            id: 'security-project',
            title: 'Security Assessment Project',
            type: 'project',
            difficulty: 'advanced',
            xpReward: 400,
            duration: '2 weeks',
            completed: false,
            locked: true,
            prerequisite: ['compliance-governance'],
            position: { x: 30, y: 70 },
            description: 'Conduct a comprehensive security assessment',
            skills: ['Risk Assessment', 'Security Audit', 'Report Writing'],
            courseLinks: [
              { platform: 'VulnHub', url: 'https://www.vulnhub.com/', title: 'Practice Labs' },
              { platform: 'HackTheBox', url: 'https://www.hackthebox.eu/', title: 'Penetration Testing Labs' }
            ]
          },
          {
            id: 'threat-hunting',
            title: 'Threat Hunting',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 280,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['security-project'],
            position: { x: 70, y: 70 },
            description: 'Proactively hunt for advanced persistent threats',
            skills: ['Threat Intelligence', 'IOCs', 'Behavioral Analysis'],
            courseLinks: [
              { platform: 'SANS', url: 'https://www.sans.org/courses/threat-hunting/', title: 'SANS Threat Hunting' },
              { platform: 'MITRE ATT&CK', url: 'https://attack.mitre.org/', title: 'ATT&CK Framework' }
            ]
          },
          {
            id: 'cybersecurity-milestone',
            title: 'Cybersecurity Expert',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1400,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['threat-hunting'],
            position: { x: 50, y: 85 },
            description: 'Master cybersecurity analyst ready to defend!',
            skills: ['All Cybersecurity Skills']
          }
        ],
        'Cloud Architect': [
          {
            id: 'cloud-fundamentals',
            title: 'Cloud Computing Fundamentals',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 120,
            duration: '4 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Understand cloud computing models and services',
            skills: ['IaaS', 'PaaS', 'SaaS', 'Cloud Models', 'Service Types'],
            courseLinks: [
              { platform: 'AWS', url: 'https://aws.amazon.com/training/digital/', title: 'AWS Digital Training' },
              { platform: 'Microsoft Learn', url: 'https://learn.microsoft.com/en-us/training/azure/', title: 'Azure Fundamentals' }
            ]
          },
          {
            id: 'aws-services',
            title: 'AWS Core Services',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '8 hours',
            completed: false,
            locked: true,
            prerequisite: ['cloud-fundamentals'],
            position: { x: 20, y: 25 },
            description: 'Master AWS core services and architecture',
            skills: ['EC2', 'S3', 'RDS', 'VPC', 'Lambda', 'CloudFormation'],
            courseLinks: [
              { platform: 'AWS Training', url: 'https://aws.amazon.com/training/', title: 'AWS Solutions Architect' },
              { platform: 'A Cloud Guru', url: 'https://acloudguru.com/aws-cloud-training', title: 'AWS Training Courses' }
            ]
          },
          {
            id: 'azure-services',
            title: 'Azure Cloud Services',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '8 hours',
            completed: false,
            locked: true,
            prerequisite: ['cloud-fundamentals'],
            position: { x: 50, y: 25 },
            description: 'Learn Microsoft Azure services and solutions',
            skills: ['Azure VMs', 'Azure Storage', 'Azure SQL', 'ARM Templates'],
            courseLinks: [
              { platform: 'Microsoft Learn', url: 'https://learn.microsoft.com/en-us/azure/', title: 'Azure Architecture Center' },
              { platform: 'Pluralsight', url: 'https://www.pluralsight.com/paths/azure-solutions-architect', title: 'Azure Solutions Architect' }
            ]
          },
          {
            id: 'gcp-services',
            title: 'Google Cloud Platform',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 200,
            duration: '8 hours',
            completed: false,
            locked: true,
            prerequisite: ['cloud-fundamentals'],
            position: { x: 80, y: 25 },
            description: 'Explore Google Cloud services and architecture',
            skills: ['Compute Engine', 'Cloud Storage', 'BigQuery', 'Kubernetes Engine'],
            courseLinks: [
              { platform: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google/', title: 'GCP Learning Paths' },
              { platform: 'Coursera', url: 'https://www.coursera.org/googlecloud', title: 'Google Cloud Courses' }
            ]
          },
          {
            id: 'cloud-security',
            title: 'Cloud Security & Compliance',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 250,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['aws-services', 'azure-services', 'gcp-services'],
            position: { x: 25, y: 40 },
            description: 'Implement security best practices in the cloud',
            skills: ['IAM', 'Encryption', 'Security Groups', 'Compliance'],
            courseLinks: [
              { platform: 'AWS Security', url: 'https://aws.amazon.com/training/path-security/', title: 'AWS Security Learning Path' },
              { platform: 'Azure Security Center', url: 'https://learn.microsoft.com/en-us/azure/security/', title: 'Azure Security Documentation' }
            ]
          },
          {
            id: 'cloud-migration',
            title: 'Cloud Migration Strategies',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 220,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['cloud-security'],
            position: { x: 75, y: 40 },
            description: 'Plan and execute cloud migration projects',
            skills: ['Migration Planning', '6 Rs Strategy', 'Hybrid Cloud'],
            courseLinks: [
              { platform: 'AWS Migration Hub', url: 'https://aws.amazon.com/migration-hub/', title: 'AWS Migration Resources' },
              { platform: 'Microsoft', url: 'https://azure.microsoft.com/en-us/migration/', title: 'Azure Migration Center' }
            ]
          },
          {
            id: 'serverless-architecture',
            title: 'Serverless Architecture',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 280,
            duration: '7 hours',
            completed: false,
            locked: true,
            prerequisite: ['cloud-migration'],
            position: { x: 35, y: 55 },
            description: 'Design and implement serverless solutions',
            skills: ['Lambda', 'Azure Functions', 'API Gateway', 'Event-driven Architecture'],
            courseLinks: [
              { platform: 'Serverless Framework', url: 'https://www.serverless.com/learn/', title: 'Serverless Learning' },
              { platform: 'AWS Lambda', url: 'https://aws.amazon.com/lambda/resources/', title: 'Lambda Resources' }
            ]
          },
          {
            id: 'multi-cloud-strategy',
            title: 'Multi-Cloud & Hybrid Solutions',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 300,
            duration: '8 hours',
            completed: false,
            locked: true,
            prerequisite: ['serverless-architecture'],
            position: { x: 65, y: 55 },
            description: 'Architect solutions across multiple cloud providers',
            skills: ['Multi-cloud Strategy', 'Hybrid Architecture', 'Cloud Interoperability'],
            courseLinks: [
              { platform: 'HashiCorp', url: 'https://learn.hashicorp.com/terraform', title: 'Multi-cloud with Terraform' },
              { platform: 'Kubernetes', url: 'https://kubernetes.io/docs/concepts/', title: 'Container Orchestration' }
            ]
          },
          {
            id: 'cloud-architecture-project',
            title: 'Enterprise Cloud Architecture',
            type: 'project',
            difficulty: 'advanced',
            xpReward: 450,
            duration: '3 weeks',
            completed: false,
            locked: true,
            prerequisite: ['multi-cloud-strategy'],
            position: { x: 50, y: 70 },
            description: 'Design a complete enterprise cloud solution',
            skills: ['Solution Architecture', 'Cost Optimization', 'Performance Tuning'],
            courseLinks: [
              { platform: 'AWS Well-Architected', url: 'https://aws.amazon.com/architecture/well-architected/', title: 'Well-Architected Framework' },
              { platform: 'Azure Architecture Center', url: 'https://learn.microsoft.com/en-us/azure/architecture/', title: 'Azure Reference Architectures' }
            ]
          },
          {
            id: 'cloud-architect-milestone',
            title: 'Cloud Architecture Master',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1500,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['cloud-architecture-project'],
            position: { x: 50, y: 85 },
            description: 'Expert cloud architect ready for enterprise solutions!',
            skills: ['All Cloud Architecture Skills']
          }
        ],
        'Product Manager': [
          {
            id: 'product-fundamentals',
            title: 'Product Management Fundamentals',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 100,
            duration: '4 hours',
            completed: false,
            locked: false,
            position: { x: 50, y: 10 },
            description: 'Learn core product management principles and methodologies',
            skills: ['Product Strategy', 'Product Lifecycle', 'Stakeholder Management'],
            courseLinks: [
              { platform: 'Product School', url: 'https://productschool.com/', title: 'Product Management Courses' },
              { platform: 'Coursera', url: 'https://www.coursera.org/specializations/product-management', title: 'Product Management Specialization' }
            ]
          },
          {
            id: 'market-research',
            title: 'Market Research & Analysis',
            type: 'lesson',
            difficulty: 'beginner',
            xpReward: 120,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['product-fundamentals'],
            position: { x: 25, y: 25 },
            description: 'Conduct market research and competitive analysis',
            skills: ['Market Analysis', 'Competitive Intelligence', 'Customer Insights'],
            courseLinks: [
              { platform: 'Google Analytics Academy', url: 'https://analytics.google.com/analytics/academy/', title: 'Analytics Training' },
              { platform: 'Survey Monkey', url: 'https://www.surveymonkey.com/market-research/resources/', title: 'Market Research Resources' }
            ]
          },
          {
            id: 'user-research-pm',
            title: 'User Research & Validation',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 150,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['market-research'],
            position: { x: 75, y: 25 },
            description: 'Understand user needs and validate product ideas',
            skills: ['User Interviews', 'Surveys', 'A/B Testing', 'Customer Validation'],
            courseLinks: [
              { platform: 'IDEO Design Kit', url: 'https://www.designkit.org/methods', title: 'Human-Centered Design Methods' },
              { platform: 'UserInterviews', url: 'https://www.userinterviews.com/blog', title: 'User Research Blog' }
            ]
          },
          {
            id: 'product-strategy',
            title: 'Product Strategy & Roadmapping',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 180,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['user-research-pm'],
            position: { x: 35, y: 40 },
            description: 'Develop product strategy and create roadmaps',
            skills: ['Product Roadmaps', 'OKRs', 'Prioritization', 'Strategic Planning'],
            courseLinks: [
              { platform: 'ProductPlan', url: 'https://www.productplan.com/learn/', title: 'Product Roadmap Guide' },
              { platform: 'Mind the Product', url: 'https://www.mindtheproduct.com/', title: 'Product Management Resources' }
            ]
          },
          {
            id: 'agile-scrum',
            title: 'Agile & Scrum Methodologies',
            type: 'lesson',
            difficulty: 'intermediate',
            xpReward: 160,
            duration: '5 hours',
            completed: false,
            locked: true,
            prerequisite: ['product-strategy'],
            position: { x: 65, y: 40 },
            description: 'Master agile development and scrum practices',
            skills: ['Agile', 'Scrum', 'Sprint Planning', 'User Stories'],
            courseLinks: [
              { platform: 'Scrum.org', url: 'https://www.scrum.org/learn', title: 'Scrum Learning Path' },
              { platform: 'Atlassian', url: 'https://www.atlassian.com/agile', title: 'Agile Coach' }
            ]
          },
          {
            id: 'data-analytics-pm',
            title: 'Product Analytics & Metrics',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 200,
            duration: '7 hours',
            completed: false,
            locked: true,
            prerequisite: ['agile-scrum'],
            position: { x: 20, y: 55 },
            description: 'Measure product success with data and analytics',
            skills: ['KPIs', 'Product Metrics', 'Data Analysis', 'Growth Metrics'],
            courseLinks: [
              { platform: 'Mixpanel', url: 'https://mixpanel.com/blog/category/product-analytics/', title: 'Product Analytics Resources' },
              { platform: 'Amplitude', url: 'https://amplitude.com/learn/', title: 'Digital Analytics Guide' }
            ]
          },
          {
            id: 'go-to-market',
            title: 'Go-to-Market Strategy',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 220,
            duration: '6 hours',
            completed: false,
            locked: true,
            prerequisite: ['data-analytics-pm'],
            position: { x: 80, y: 55 },
            description: 'Plan and execute successful product launches',
            skills: ['Launch Planning', 'Marketing Strategy', 'Sales Enablement'],
            courseLinks: [
              { platform: 'HubSpot Academy', url: 'https://academy.hubspot.com/', title: 'Go-to-Market Courses' },
              { platform: 'Product Marketing Alliance', url: 'https://productmarketingalliance.com/', title: 'Product Marketing Resources' }
            ]
          },
          {
            id: 'stakeholder-communication',
            title: 'Stakeholder Management',
            type: 'lesson',
            difficulty: 'advanced',
            xpReward: 180,
            duration: '4 hours',
            completed: false,
            locked: true,
            prerequisite: ['go-to-market'],
            position: { x: 35, y: 70 },
            description: 'Effectively communicate with all stakeholders',
            skills: ['Executive Communication', 'Presentation Skills', 'Influence'],
            courseLinks: [
              { platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/topics/communication-skills', title: 'Communication Skills Courses' },
              { platform: 'Toastmasters', url: 'https://www.toastmasters.org/', title: 'Public Speaking Skills' }
            ]
          },
          {
            id: 'product-case-study',
            title: 'Product Management Capstone',
            type: 'project',
            difficulty: 'advanced',
            xpReward: 400,
            duration: '3 weeks',
            completed: false,
            locked: true,
            prerequisite: ['stakeholder-communication'],
            position: { x: 65, y: 70 },
            description: 'Complete end-to-end product management case study',
            skills: ['Product Strategy', 'Execution', 'Launch', 'Optimization'],
            courseLinks: [
              { platform: 'Case Study Club', url: 'https://www.casestudyclub.com/', title: 'PM Case Studies' },
              { platform: 'Product Management Exercises', url: 'https://www.productmanagementexercises.com/', title: 'PM Practice Problems' }
            ]
          },
          {
            id: 'product-manager-milestone',
            title: 'Product Management Master',
            type: 'milestone',
            difficulty: 'advanced',
            xpReward: 1200,
            duration: 'Achievement',
            completed: false,
            locked: true,
            prerequisite: ['product-case-study'],
            position: { x: 50, y: 85 },
            description: 'Expert product manager ready to lead products!',
            skills: ['All Product Management Skills']
          }
        ]
      };

      return roadmaps[role] || roadmaps['Frontend Developer'];
    };

    // Get the desired role from analysisResult or default to Frontend Developer
    const desiredRole = analysisResult?.desired_role || 'Frontend Developer';
    const missingSkills = analysisResult?.missing_skills || [];
    
    setRoadmapData(generateRoadmap(desiredRole, missingSkills));
  }, [analysisResult]);

  const handleCompleteNode = (nodeId: string, xpReward: number) => {
    setRoadmapData(prev => {
      const updated = prev.map(node => {
        if (node.id === nodeId) {
          return { ...node, completed: true };
        }
        // Unlock next nodes
        if (node.prerequisite?.includes(nodeId)) {
          const allPrerequisitesMet = node.prerequisite.every(prereq => 
            prev.find(n => n.id === prereq)?.completed || prereq === nodeId
          );
          if (allPrerequisitesMet) {
            return { ...node, locked: false };
          }
        }
        return node;
      });
      return updated;
    });

    updateUser({ 
      xp: (user?.xp || 0) + xpReward,
      level: Math.floor(((user?.xp || 0) + xpReward) / 1000) + 1
    });
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'quiz': return Brain;
      case 'project': return Code;
      case 'assessment': return Target;
      case 'milestone': return Trophy;
      default: return BookOpen;
    }
  };

  const getNodeColor = (node: RoadmapNode) => {
    if (node.completed) return 'from-green-400 to-green-600';
    if (node.locked) return 'from-gray-300 to-gray-400';
    switch (node.type) {
      case 'lesson': return 'from-blue-400 to-blue-600';
      case 'quiz': return 'from-purple-400 to-purple-600';
      case 'project': return 'from-orange-400 to-orange-600';
      case 'assessment': return 'from-red-400 to-red-600';
      case 'milestone': return 'from-yellow-400 to-yellow-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
    }
  };

  // Helper function to calculate line coordinates
  const calculateLineCoordinates = (startNode: RoadmapNode, endNode: RoadmapNode, containerWidth: number, containerHeight: number) => {
    const nodeRadius = 40; // Half of node width/height (80px)
    
    // Calculate actual pixel positions
    const startX = (startNode.position.x / 100) * containerWidth;
    const startY = (startNode.position.y / 100) * containerHeight;
    const endX = (endNode.position.x / 100) * containerWidth;
    const endY = (endNode.position.y / 100) * containerHeight;
    
    // Calculate the angle between nodes
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return { x1: startX, y1: startY, x2: endX, y2: endY };
    
    // Calculate unit vector
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    // Adjust start and end points to be at edge of circles
    const adjustedStartX = startX + (unitX * nodeRadius);
    const adjustedStartY = startY + (unitY * nodeRadius);
    const adjustedEndX = endX - (unitX * nodeRadius);
    const adjustedEndY = endY - (unitY * nodeRadius);
    
    return {
      x1: adjustedStartX,
      y1: adjustedStartY,
      x2: adjustedEndX,
      y2: adjustedEndY
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Roadmap</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {analysisResult 
              ? `Personalized path for ${analysisResult.desired_role}`
              : "Follow your personalized path to mastery"
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level {user?.level || 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.xp || 0} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {roadmapData.filter(n => n.completed).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {roadmapData.filter(n => !n.locked && !n.completed).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {roadmapData.filter(n => n.locked).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Locked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round((roadmapData.filter(n => n.completed).length / roadmapData.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
          </div>
        </div>
      </div>

      {/* No Analysis Result Message */}
      {!analysisResult && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                Complete Skill Analysis First
              </h3>
              <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                To get a personalized learning roadmap, please upload your resume and complete the skill analysis first.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div 
          className="relative min-h-screen min-w-full"
          style={{ width: '800px', height: '1000px' }}
        >
          {/* Connection Lines */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
            viewBox="0 0 800 1000"
            preserveAspectRatio="none"
          >
            {roadmapData.map(node => {
              if (!node.prerequisite) return null;
              return node.prerequisite.map(prereqId => {
                const prereqNode = roadmapData.find(n => n.id === prereqId);
                if (!prereqNode) return null;
                
                const coords = calculateLineCoordinates(prereqNode, node, 800, 1000);
                
                return (
                  <line
                    key={`${prereqId}-${node.id}`}
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
                    stroke={node.completed || prereqNode.completed ? '#10B981' : '#D1D5DB'}
                    strokeWidth="3"
                    strokeDasharray={node.locked ? '5,5' : '0'}
                    markerEnd="url(#arrowhead)"
                  />
                );
              });
            })}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#D1D5DB"
                />
              </marker>
            </defs>
          </svg>

          {/* Roadmap Nodes */}
          {roadmapData.map((node) => {
            const IconComponent = getNodeIcon(node.type);
            const nodeColor = getNodeColor(node);
            
            return (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                  zIndex: 2
                }}
              >
                <div 
                  className={`relative group cursor-pointer ${
                    node.locked ? 'opacity-60' : 'hover:scale-110'
                  } transition-all duration-300`}
                  onClick={() => setSelectedNode(node)}
                >
                  {/* Node Circle */}
                  <div className={`
                    w-20 h-20 rounded-full bg-gradient-to-br ${nodeColor} 
                    flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800
                  `}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Completion Badge */}
                  {node.completed && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Lock Badge */}
                  {node.locked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Node Title */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {node.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {node.duration}
                    </div>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg p-2 whitespace-nowrap pointer-events-none">
                    +{node.xpReward} XP • {node.difficulty}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedNode.title}
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                {selectedNode.description}
              </p>

              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedNode.difficulty)}`}>
                  {selectedNode.difficulty}
                </span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{selectedNode.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">+{selectedNode.xpReward} XP</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Skills You'll Learn:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Course Links */}
              {selectedNode.courseLinks && selectedNode.courseLinks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommended Courses:</h4>
                  <div className="space-y-2">
                    {selectedNode.courseLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-blue-800 dark:text-blue-200">
                            {link.title}
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            {link.platform}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                {selectedNode.completed ? (
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                ) : selectedNode.locked ? (
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Complete prerequisites first</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleCompleteNode(selectedNode.id, selectedNode.xpReward);
                      setSelectedNode(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Start Learning</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
