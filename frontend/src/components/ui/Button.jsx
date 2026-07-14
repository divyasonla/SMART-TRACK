import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon: Icon,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeClasses = "px-6 py-3 text-sm";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md",
    secondary: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-md",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 focus:ring-blue-500 bg-white",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-md"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </motion.button>
  );
};
