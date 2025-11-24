import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { storage } from '@/utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@fst.me',
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@fst.me',
      name: 'Admin FST',
      role: 'admin',
      phone: '+382 67 123 456',
    },
  },
  {
    email: 'serviser@fst.me',
    password: 'serviser123',
    user: {
      id: '2',
      email: 'serviser@fst.me',
      name: 'Marko Petrović',
      role: 'technician',
      phone: '+382 67 234 567',
      specialties: ['washing_machine', 'dishwasher', 'dryer'],
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await storage.getUser();
      setUser(savedUser);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      setUser(found.user);
      await storage.setUser(found.user);
      return true;
    }

    return false;
  };

  const logout = async () => {
    setUser(null);
    await storage.setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
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
