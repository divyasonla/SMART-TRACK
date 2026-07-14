import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard component to restrict access to authenticated users.
 * Shows a loading spinner during session recovery, then redirects to login
 * if unauthenticated, or renders child routes (via Outlet) if authenticated.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render child components, otherwise redirect to login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};
