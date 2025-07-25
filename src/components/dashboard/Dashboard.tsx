import { useState } from 'react'; //React, 
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Overview from './Overview';
import SkillAnalysis from './SkillAnalysis';
import LearningPath from './LearningPath';
import Quiz from './Quiz';
import MockInterview from './MockInterview';
import Progress from './Progress';
import Profile from './Profile';
import Chatbot from './Chatbot';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const { user } = useAuth();

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
      case 'progress':
        return <Progress />;
      case 'profile':
        return <Profile />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Continue your learning journey and track your progress
            </p>
          </div>
          {renderContent()}
        </div>
      </main>
      <Chatbot/>
    </div>
  );
}