// src/context/AuthContext.js
import React, { useEffect, createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({})
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
    }
}, [user._id]);
  const login = (user) => {
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
