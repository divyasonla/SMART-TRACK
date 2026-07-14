import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = "neo-card overflow-hidden transition-all duration-300";
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, x: -4, boxShadow: "8px 8px 0px var(--shadow-color)" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`${baseClasses} hover:border-[var(--color-primary)] ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b-4 border-[var(--border-color)] bg-[var(--bg-main)] ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t-4 border-[var(--border-color)] bg-[var(--bg-main)] ${className}`}>
    {children}
  </div>
);
