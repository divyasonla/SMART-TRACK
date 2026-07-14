import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Target, Activity, BarChart2, User, Bell, Menu, X, LogOut, Calendar, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const themes = ['light', 'dark', 'cyberpunk', 'mecha'];

export const TopNavbar = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Phases', path: '/phases', icon: Activity },
    { name: 'Goals', path: '/workspace', icon: Target },
    { name: 'Tracker', path: '/tracker', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Neo-Brutalist Floating Navbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[96%] max-w-[1200px] h-16 neo-card z-50 flex items-center justify-between px-3 sm:px-6">
          
        {/* Left: Logo & App Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/phases')}
        >
          <div className="w-10 h-10 bg-[var(--color-primary)] border-2 border-[var(--border-color)] flex items-center justify-center text-[var(--bg-main)] font-black text-xl shadow-[3px_3px_0px_var(--shadow-color)] group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_var(--shadow-color)] transition-all duration-200 rounded-sm">
            G
          </div>
          <span className="anime-heading font-bold text-xl text-[var(--color-primary)] hidden md:block" style={{textShadow: '2px 2px 0px var(--shadow-color)'}}>
            GoalTracker
          </span>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex items-center p-1 bg-[var(--bg-main)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)]">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `relative flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold transition-colors duration-200 uppercase tracking-wide ${
                  isActive 
                    ? 'text-[var(--bg-main)]' 
                    : 'text-[var(--text-main)] hover:bg-[var(--color-accent)] hover:text-[var(--bg-main)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-[var(--bg-main)]' : ''}`} />
                  <span className="z-10">{item.name}</span>
                  {isActive && (
                    <motion.layoutId 
                      layoutId="nav-active"
                      className="absolute inset-0 bg-[var(--color-primary)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] -z-0"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Cycler */}
          <button 
            onClick={cycleTheme}
            className="p-2 bg-[var(--bg-main)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] text-[var(--text-main)] hover:bg-[var(--color-secondary)] hover:text-[var(--bg-main)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--shadow-color)] transition-all hidden sm:flex items-center gap-2 font-bold uppercase text-xs"
            title={`Current Theme: ${currentTheme}`}
          >
            <Palette className="w-4 h-4" />
            <span className="hidden xl:block">{currentTheme}</span>
          </button>
          
          <button className="p-2 bg-[var(--bg-main)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] text-[var(--text-main)] hover:bg-[var(--color-accent)] hover:text-[var(--bg-main)] hover:-translate-y-0.5 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-secondary)] border-2 border-[var(--border-color)] rounded-full animate-bounce"></span>
          </button>

          <div className="h-8 w-1 bg-[var(--border-color)] mx-1 hidden sm:block"></div>

          {/* User Profile Component */}
          <div 
            className="flex items-center gap-2 cursor-pointer bg-[var(--bg-main)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--shadow-color)] p-1 pr-3 transition-all"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 bg-[var(--color-primary)] border-2 border-[var(--border-color)] flex items-center justify-center flex-shrink-0">
               <span className="text-sm font-black text-[var(--bg-main)]">S</span>
            </div>
            <span className="anime-heading text-sm font-bold text-[var(--text-main)] hidden md:block">Sheikh</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 bg-[var(--bg-main)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] text-[var(--text-main)] transition-all ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-4 right-4 neo-card z-40 lg:hidden"
          >
            <div className="p-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 text-base font-bold transition-all border-2 uppercase ${
                      isActive 
                        ? 'bg-[var(--color-primary)] text-[var(--bg-main)] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] -translate-y-1' 
                        : 'bg-[var(--bg-main)] text-[var(--text-main)] border-transparent hover:border-[var(--border-color)] hover:bg-[var(--color-accent)]'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              ))}
              
              <div className="h-1 bg-[var(--border-color)] w-full my-2"></div>
              
              <button 
                onClick={cycleTheme}
                className="flex items-center justify-between px-4 py-3 text-base font-bold uppercase bg-[var(--bg-main)] border-2 border-[var(--border-color)] text-[var(--text-main)] shadow-[4px_4px_0px_var(--shadow-color)]"
              >
                <span className="flex items-center gap-2"><Palette className="w-5 h-5" /> Theme: {currentTheme}</span>
                <span>SWITCH</span>
              </button>

              <button 
                className="flex items-center justify-center gap-2 px-4 py-3 text-base font-bold uppercase bg-[var(--color-secondary)] text-[var(--bg-main)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 transition-all"
                onClick={() => navigate('/')}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
