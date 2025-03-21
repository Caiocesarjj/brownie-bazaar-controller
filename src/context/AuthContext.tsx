
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/database/types';
import { UserAPI } from '@/lib/database/models';

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === 'admin');
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const authenticatedUser = await UserAPI.authenticate(username, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setIsAdmin(authenticatedUser.role === 'admin');
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
