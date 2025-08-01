import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
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
  try {
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Login error:', err);
    return false;
  }
};

const signup = async (email: string, password: string, name: string): Promise<boolean> => {
  try {
    const res = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) throw new Error('Signup failed');

    const data = await res.json();
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Signup error:', err);
    return false;
  }
};



  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // AuthContext.tsx

const updateUser = async (updatedData: Partial<User>) => {
  try {
    if (!user) {
      console.error("User is not logged in");
    return;
  }
    const res = await fetch(`http://localhost:4000/api/users/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    if (!res.ok) throw new Error('Failed to update user in database');

    const updatedUser = await res.json();
    setUser(updatedUser); // Update frontend state with new user from DB
  } catch (error) {
    console.error('Error updating user:', error);
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
