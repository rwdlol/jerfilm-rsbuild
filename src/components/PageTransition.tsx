import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, scale: 0.98, filter: 'blur(4px)' }}
      transition={{ 
        type: 'spring',
        stiffness: 260,
        damping: 25,
        mass: 0.8
      }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
};
