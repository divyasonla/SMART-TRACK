import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 pb-16 md:pb-0 relative min-h-screen">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 -left-24 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        
        <main className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
