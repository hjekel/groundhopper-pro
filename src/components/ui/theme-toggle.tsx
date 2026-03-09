'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(stored || systemPreference);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return <div className={`w-14 h-14 ${className}`} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-14 rounded-xl bg-gradient-to-br transition-all duration-300 ${
        isDark 
          ? 'from-slate-800 to-slate-900 shadow-lg shadow-green-500/20 hover:shadow-green-500/40' 
          : 'from-sky-100 to-blue-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Stadium floodlight structure */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pole */}
        <motion.rect
          x="46"
          y="45"
          width="8"
          height="50"
          rx="2"
          className={isDark ? 'fill-slate-600' : 'fill-slate-400'}
        />
        
        {/* Light housing top */}
        <motion.path
          d="M25 20 L75 20 L70 40 L30 40 Z"
          className={isDark ? 'fill-slate-500' : 'fill-slate-300'}
          stroke={isDark ? '#475569' : '#94a3b8'}
          strokeWidth="2"
        />
        
        {/* Light bulbs/reflectors */}
        {[0, 1, 2, 3].map((i) => (
          <motion.rect
            key={i}
            x={32 + i * 10}
            y="25"
            width="6"
            height="10"
            rx="1"
            className={isDark ? 'fill-slate-600' : 'fill-slate-200'}
            initial={false}
            animate={{
              fill: isDark ? '#fef08a' : '#e2e8f0',
            }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
        
        {/* Light beams (only visible in dark mode) */}
        <motion.g
          initial={false}
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Main beam - center */}
          <motion.path
            d="M50 40 L35 90 L65 90 Z"
            fill="url(#beamGradient)"
            opacity="0.4"
          />
          {/* Left beam */}
          <motion.path
            d="M38 40 L15 85 L35 85 Z"
            fill="url(#beamGradient)"
            opacity="0.25"
          />
          {/* Right beam */}
          <motion.path
            d="M62 40 L65 85 L85 85 Z"
            fill="url(#beamGradient)"
            opacity="0.25"
          />
        </motion.g>
        
        {/* Sun (light mode) */}
        <motion.g
          initial={false}
          animate={{ 
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1,
            y: isDark ? 10 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <circle cx="75" cy="15" r="8" className="fill-amber-400" />
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.line
              key={i}
              x1={75 + Math.cos(angle * Math.PI / 180) * 10}
              y1={15 + Math.sin(angle * Math.PI / 180) * 10}
              x2={75 + Math.cos(angle * Math.PI / 180) * 14}
              y2={15 + Math.sin(angle * Math.PI / 180) * 14}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </motion.g>
        
        {/* Moon (dark mode) */}
        <motion.g
          initial={false}
          animate={{ 
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.5,
            y: isDark ? 0 : -10
          }}
          transition={{ duration: 0.3 }}
        >
          <circle cx="75" cy="12" r="7" className="fill-slate-200" />
          <circle cx="78" cy="10" r="6" className="fill-slate-800" />
          {/* Stars */}
          <circle cx="20" cy="10" r="1" className="fill-white" />
          <circle cx="15" cy="18" r="0.5" className="fill-white" />
          <circle cx="85" cy="25" r="0.8" className="fill-white" />
        </motion.g>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="beamGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Glow effect when lights are on */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={false}
        animate={{
          boxShadow: isDark 
            ? '0 0 20px rgba(250, 204, 21, 0.3), inset 0 0 10px rgba(250, 204, 21, 0.1)'
            : '0 0 0px transparent',
        }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
}

// Compact version for header
export function ThemeToggleCompact({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(stored || systemPreference);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return <div className={`w-10 h-10 ${className}`} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
        isDark 
          ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
          : 'bg-sky-100 hover:bg-sky-200 text-amber-500'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stadium light icon */}
        <motion.g
          initial={false}
          animate={{ opacity: isDark ? 1 : 0 }}
        >
          {/* Pole */}
          <rect x="11" y="12" width="2" height="10" rx="0.5" fill="currentColor" opacity="0.6" />
          {/* Light housing */}
          <path d="M6 4 L18 4 L16 10 L8 10 Z" fill="currentColor" />
          {/* Beams */}
          <path d="M12 10 L8 22 L16 22 Z" fill="currentColor" opacity="0.3" />
        </motion.g>
        
        <motion.g
          initial={false}
          animate={{ opacity: isDark ? 0 : 1 }}
        >
          {/* Sun */}
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1={12 + Math.cos(angle * Math.PI / 180) * 6}
              y1={12 + Math.sin(angle * Math.PI / 180) * 6}
              x2={12 + Math.cos(angle * Math.PI / 180) * 8}
              y2={12 + Math.sin(angle * Math.PI / 180) * 8}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </motion.g>
      </svg>
    </button>
  );
}
