import { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Default to dark mode
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <button
      data-testid="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary active:scale-95 transition-all duration-300"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="flex h-full w-full items-center justify-center">
        {isDark ? (
          <span className="bg-gray-800 rounded-full p-2 inline-flex items-center justify-center">
            <Moon className="w-4 h-4" style={{ color: '#F59E0B' }} />
          </span>
        ) : (
          '☀️'
        )}
      </span>
    </button>
  );
};
