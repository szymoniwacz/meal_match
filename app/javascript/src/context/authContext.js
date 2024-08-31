import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsAuthenticated(true);
      setUserEmail(user.email);
    }
  }, []);

  const login = (email) => {
    // Example login logic (should be replaced with real authentication logic)
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('user', JSON.stringify({ email }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
