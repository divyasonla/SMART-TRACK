import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';

// Dashboard Pages
import { Phases } from './pages/dashboard/Phases';
import { GoalWorkspace } from './pages/dashboard/GoalWorkspace';
import { Tracker } from './pages/dashboard/Tracker';
import { Analytics } from './pages/dashboard/Analytics';
import { Profile } from './pages/dashboard/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/phases" element={<Phases />} />
          <Route path="/workspace" element={<GoalWorkspace />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
