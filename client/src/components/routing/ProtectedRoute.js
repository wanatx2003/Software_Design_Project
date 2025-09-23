import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, isAdmin, children }) => {
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If admin access is required but user is not an admin
  if (isAdmin !== undefined && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  // User is authenticated and has necessary permissions
  return children;
};

export default ProtectedRoute;
