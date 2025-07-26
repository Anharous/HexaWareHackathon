import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  profileComplete: boolean;
  skills: string[];
  currentRole: string;
  desiredRole: string;
  xp: number;
  level: number;
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Simulate loading user from localStorage
  const savedUser = localStorage.getItem('user');
  if (savedUser && savedUser !== "undefined") {
    try {
      setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
      localStorage.removeItem('user');
    }
  }
  setLoading(false);
}, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call your Python backend
    if (email === 'admin@company.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        email,
        name: 'System Admin',
        role: 'admin',
        profileComplete: true,
        skills: [],
        currentRole: 'Administrator',
        desiredRole: 'Administrator',
        xp: 0,
        level: 1,
        badges: []
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    if (email === 'employee@company.com' && password === 'employee123') {
      const employeeUser: User = {
        id: 'emp-1',
        email,
        name: 'John Developer',
        role: 'employee',
        profileComplete: false,
        skills: ['JavaScript', 'React', 'Node.js'],
        currentRole: 'Junior Developer',
        desiredRole: 'Senior Full Stack Developer',
        xp: 1250,
        level: 3,
        badges: ['First Steps', 'Quiz Master']
      };
      setUser(employeeUser);
      localStorage.setItem('user', JSON.stringify(employeeUser));
      return true;
    }
    
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock signup
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'employee',
      profileComplete: false,
      skills: [],
      currentRole: '',
      desiredRole: '',
      xp: 0,
      level: 1,
      badges: []
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}