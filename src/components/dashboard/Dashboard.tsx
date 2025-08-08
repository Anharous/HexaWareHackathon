import { useEffect, useState } from 'react'; //React, 
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Overview from './Overview';
import SkillAnalysis from './SkillAnalysis';
import LearningPath from './LearningPath';
import Quiz from './Quiz';
import MockInterview from './MockInterview';
import Progress from './Progress';
import Profile from './Profile';
import Guild from './Guild';
import StudyChat from './StudyChat';
import Chatbot from './Chatbot';
import MentorBooking from './MentorBooking';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme); // Save preference
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'skills':
        return <SkillAnalysis />;
      case 'learning':
        return <LearningPath />;
      case 'quiz':
        return <Quiz />;
      case 'interview':
        return <MockInterview />;
      case 'calendar':   
        return <MentorBooking />;   
      case 'progress':
        return <Progress />;
      case 'profile':
        return <Profile />;
      case 'guild':
        return <Guild />;
      case 'studychat':
        return <StudyChat />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Continue your learning journey and track your progress
              </p>
            </div>
            <button
             onClick={toggleTheme}
              className="text-2xl bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded-full hover:scale-105 transition-all"
              title="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
          {renderContent()}
        </div>
      </main>
      <Chatbot />
    </div>
  );
}