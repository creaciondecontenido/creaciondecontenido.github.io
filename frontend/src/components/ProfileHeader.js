import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const StatItem = ({ label, value, suffix = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      ref={ref}
      className="text-center min-w-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="font-mono font-bold text-base sm:text-lg md:text-xl text-foreground" data-testid={`stat-${label.toLowerCase()}`}>
        {isVisible ? `${value}${suffix}` : '0'}
      </span>
      <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
};

export const ProfileHeader = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const profileImage = "https://images.unsplash.com/photo-1684132052745-23cd410ecd31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwyfHxmZW1hbGUlMjBiYWtlciUyMHBvcnRyYWl0JTIwYWVzdGhldGljfGVufDB8fHx8MTc3Mjc0MTU1NXww&ixlib=rb-4.1.0&q=85&w=400";

  return (
    <header className="w-full" data-testid="profile-header">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between py-4 px-4 md:px-0 border-b border-border">
        <div className="flex items-center gap-2">
          <h1 className="text-base md:text-lg font-semibold">sweetdeliriumcookies</h1>
          <BadgeCheck className="w-4 h-4" fill="#1D9BF0" color="white" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="py-6 px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Avatar */}
          <motion.div 
            className="avatar-ring flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <img
              src={profileImage}
              alt="@sweetdeliriumcookies"
              className="w-20 h-20 md:w-36 md:h-36 rounded-full border-4 border-background object-cover"
              data-testid="profile-avatar"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="md:hidden mb-4">
              <h2 className="text-base sm:text-lg font-semibold flex items-center justify-center gap-1.5">
                sweetdeliriumcookies
                <BadgeCheck className="w-4 h-4" fill="#1D9BF0" color="white" />
              </h2>
            </div>

            {/* Username Row - Desktop */}
            <div className="hidden md:flex items-center gap-4 mb-4">
              <h2 className="text-xl font-normal">sweetdeliriumcookies</h2>
              <motion.div
                whileTap={{ scale: 0.95 }}
              >
                <button
                  data-testid="follow-btn"
                  type="button"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-8 h-10 rounded-md ${
                    isFollowing 
                      ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                      : 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white follow-btn-pulse'
                  }`}
                >
                  {isFollowing ? (
                    <span className="flex items-center gap-2">
                      ✓
                      Following
                    </span>
                  ) : 'Follow'}
                </button>
              </motion.div>
              <button type="button" className="px-8 h-10 rounded-md border border-input hover:bg-accent hover:text-accent-foreground">
                Message
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-sm mx-auto md:max-w-none md:mx-0 md:flex md:justify-start md:gap-10 mb-4">
              <StatItem label="posts" value={245} />
              <StatItem label="followers" value={128} suffix="K" />
              <StatItem label="following" value={312} />
            </div>

            {/* Bio */}
            <div className="mt-4">
              <p className="font-semibold text-sm">Sweet Delirium Cookies</p>
              <p className="text-sm text-muted-foreground mt-1">
                Creadora de galletas artesanales 🍪<br/>
                Hecho con amor en Argentina<br/>
                <span className="text-fuchsia-400">Pedidos personalizados → DM</span>
              </p>
              <p className="text-sm text-fuchsia-400 mt-1 font-medium">
                sweetdeliriumcookies.com
              </p>
            </div>

            {/* Mobile Follow Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:hidden w-full">
              <button
                data-testid="follow-btn-mobile"
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`w-full sm:flex-1 h-10 rounded-md ${
                  isFollowing 
                    ? 'bg-secondary text-foreground' 
                    : 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button type="button" className="w-full sm:flex-1 h-10 rounded-md border border-input hover:bg-accent hover:text-accent-foreground">
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-border mt-6 -mx-4 md:mx-0">
          <div className="flex w-full md:w-auto md:mx-auto md:justify-center md:gap-12">
            <button className="flex-1 md:flex-none px-4 md:px-10 py-3 flex items-center justify-center gap-2 border-t-2 border-foreground -mt-[1px]" data-testid="posts-tab">
              <span className="w-4 h-4 inline-flex items-center justify-center">▦</span>
              <span className="text-xs font-semibold tracking-wider uppercase">Posts</span>
            </button>
            <button className="flex-1 md:flex-none px-4 md:px-10 py-3 flex items-center justify-center gap-2 text-muted-foreground">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2"/>
                <polygon points="10,8 16,12 10,16" fill="currentColor"/>
              </svg>
              <span className="text-xs font-semibold tracking-wider uppercase">Reels</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
