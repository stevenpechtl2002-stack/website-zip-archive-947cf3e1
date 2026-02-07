import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  onClick?: () => void;
  variant?: 'default' | 'admin' | 'light';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  onClick, 
  variant = 'default', 
  showText = true,
  className = '' 
}) => {
  const isClickable = !!onClick;
  
  const logoContent = (
    <>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-sm ${
        variant === 'admin' 
          ? 'bg-gradient-to-br from-primary to-violet-600 text-white'
          : variant === 'light'
          ? 'bg-gradient-to-br from-primary via-violet-500 to-pink-500 text-white shadow-lg shadow-primary/30'
          : 'bg-indigo-50 border border-slate-200 text-indigo-600'
      }`}>
        Z
      </div>
      {showText && (
        <span className={`text-xl font-black tracking-tighter ${
          variant === 'admin' 
            ? 'text-foreground'
            : variant === 'light'
            ? 'text-2xl tracking-tight text-foreground'
            : 'text-slate-800'
        }`}>
          ZenBook
          {variant === 'admin' && <span className="text-primary">Admin</span>}
          {variant === 'light' && (
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">Beauty</span>
          )}
        </span>
      )}
    </>
  );

  if (isClickable) {
    return (
      <motion.button
        onClick={onClick}
        className={`flex items-center gap-3 cursor-pointer ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {logoContent}
      </motion.button>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoContent}
    </div>
  );
};

export default Logo;
