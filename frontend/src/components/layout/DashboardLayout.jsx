import React from 'react';
import { TopNavbar } from './TopNavbar';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden">
      <TopNavbar />
      
      {/* Background gradient effects (fixed to prevent layout shift) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-100/40 via-purple-50/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[100px]" />
      </div>
      
      <main className="flex-1 pt-28 pb-12 relative z-10 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
