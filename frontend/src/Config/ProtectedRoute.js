// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (user != {} || user) {
    console.log(user)
    return <Outlet/>;
  }
  return <Navigate to="/login"/>;
};

export default ProtectedRoute;
