import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // When token changes, update localStorage and isAuthenticated
  useEffect(() => {
    if (token) {
      localStorage.setItem('access', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('access');
      setIsAuthenticated(false);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;