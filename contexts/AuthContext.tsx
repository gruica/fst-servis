import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from "../types";
import { storage } from "../utils/storage";
import { authApi } from "../utils/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOAuth: (oauthUser: User) => Promise<void>;
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
  {
    email: 'partner@fst.me',
    password: 'partner123',
    user: {
      id: '3',
      email: 'partner@fst.me',
      name: 'Aleksandar Nikolić',
      role: 'business_partner',
      phone: '+382 69 999 111',
      companyName: 'ElektroShop D.O.O',
    },
  },
  {
    email: 'supplier@fst.me',
    password: 'supplier123',
    user: {
      id: '4',
      email: 'supplier@fst.me',
      name: 'Dragana Ilić',
      role: 'supplier',
      phone: '+382 65 222 333',
      companyName: 'DelParts - Rezervni Dijelovi',
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
    // Prvo pokušaj sa backend API-jem
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.data) {
        const userData = response.data as User;
        setUser(userData);
        await storage.setUser(userData);
        return true;
      }
    } catch {
      // Fallback na demo korisnike ako API ne radi
    }

    // Fallback: Demo korisnike
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

  const loginWithOAuth = async (oauthUser: User) => {
    setUser(oauthUser);
    await storage.setUser(oauthUser);
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
        loginWithOAuth,
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
