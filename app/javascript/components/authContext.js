import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('authToken');
    if (email && token) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const login = (email, token) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
