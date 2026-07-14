import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Activity, BarChart2, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Phases', path: '/phases', icon: Activity },
    { name: 'Goal Setting', path: '/goals/new', icon: Target },
    { name: 'Reflection', path: '/reflection', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-white/70 backdrop-blur-xl border-r border-slate-200/50 shadow-lg z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            S
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">SMART-TRACK</span>
        </div>
        
        <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <NavLink to="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 flex justify-around items-center z-50 pb-safe">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};
