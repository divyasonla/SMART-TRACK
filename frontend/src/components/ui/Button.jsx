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
  const baseClasses = "inline-flex items-center justify-center font-bold uppercase tracking-wider border-[3px] border-[var(--border-color)] transition-all duration-200 focus:outline-none";
  const sizeClasses = "px-6 py-3 text-sm";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-[var(--bg-main)] shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_var(--shadow-color)]",
    secondary: "bg-[var(--color-secondary)] text-[var(--bg-main)] shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_var(--shadow-color)]",
    outline: "bg-[var(--bg-main)] text-[var(--text-main)] shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_var(--shadow-color)] hover:bg-[var(--color-accent)] hover:text-[var(--bg-main)]",
    ghost: "border-transparent text-[var(--text-main)] hover:bg-[var(--color-primary)] hover:border-[var(--border-color)] hover:text-[var(--bg-main)] hover:shadow-[4px_4px_0px_var(--shadow-color)]",
    danger: "bg-[#ff4757] text-white shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_var(--shadow-color)]",
    success: "bg-[#2ed573] text-white shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_var(--shadow-color)]"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ y: -2, x: -2 }}
      whileTap={{ y: 2, x: 2, boxShadow: "0px 0px 0px var(--shadow-color)" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
