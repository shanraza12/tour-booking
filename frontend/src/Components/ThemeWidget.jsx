import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import '../styles/DarkTheme.css';

export default function ThemeWidget() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050 }}>
      {/* Floating Theme Button */}
      <button 
        onClick={toggleTheme}
        className="btn rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center"
        style={{ 
          width: '60px', 
          height: '60px', 
          backgroundColor: isDark ? '#f1c40f' : '#2c3e50',
          color: isDark ? '#2c3e50' : 'white',
          border: 'none',
          transition: 'all 0.3s ease'
        }}
        title="Toggle Dark Theme"
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
}
