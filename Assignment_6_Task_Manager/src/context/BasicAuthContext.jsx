import React, { createContext, useContext, useState } from 'react';

const BasicAuthContext = createContext();

export const BasicAuthProvider = ({ children }) => {
  // Default to authenticated so user can freely explore, with a 1-click toggle in navbar to test protection
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    username: 'demo_user',
    displayName: 'Demo User',
    role: 'Lead Developer'
  });

  const toggleAuth = () => {
    setIsAuthenticated(prev => !prev);
  };

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BasicAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        toggleAuth,
        login,
        logout
      }}
    >
      {children}
    </BasicAuthContext.Provider>
  );
};

export const useBasicAuth = () => {
  const context = useContext(BasicAuthContext);
  if (!context) {
    throw new Error('useBasicAuth must be used within a BasicAuthProvider');
  }
  return context;
};
