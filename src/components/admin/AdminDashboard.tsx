import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import Reports from './Reports';
import SystemSettings from './SystemSettings';
import Chatbot from '../dashboard/Chatbot';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('analytics');
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
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold ">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor platform performance and manage users
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