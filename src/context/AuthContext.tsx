import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<{ user: User }>(storedToken);
        setUser(decodedToken.user);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('auth_token');
      }
    }
  }, []);

  const login = (newToken: string) => {
    try {
      const decodedToken = jwtDecode<{ user: User }>(newToken);
      setUser(decodedToken.user);
      setToken(newToken);
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', newToken);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
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