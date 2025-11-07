import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import { GoogleIcon } from './icons/GoogleIcon';
import { StarIcon } from './icons/StarIcon';

interface AuthProps {
  user: User | null;
  isLoading: boolean;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  onUpgrade: () => void;
}

const Auth: React.FC<AuthProps> = ({ user, isLoading, onGoogleSignIn, onSignOut, onUpgrade }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="w-9 h-9 bg-gray-700 rounded-full animate-pulse" />;
  }

  if (!user) {
    return (
      <button 
        onClick={onGoogleSignIn} 
        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-full transition-colors text-sm border border-white/20"
        title="Sign in with Google"
      >
        <GoogleIcon className="w-5 h-5" />
        <span className="hidden md:inline">Sign in</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-full" aria-haspopup="true" aria-expanded={menuOpen}>
        <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#282828] border border-white/10 rounded-lg shadow-lg py-1 z-30 animate-fade-in-down" role="menu">
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-sm text-gray-300">Signed in as</p>
            <p className="text-sm font-semibold truncate flex items-center gap-2">
              {user.name}
              {user.isPro && <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">PRO</span>}
            </p>
          </div>
          {!user.isPro && (
             <button
              onClick={() => {
                onUpgrade();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 flex items-center gap-2"
              role="menuitem"
            >
              <StarIcon className="w-5 h-5 text-red-400" />
              Upgrade to Pro
            </button>
          )}
          <button
            onClick={() => {
              onSignOut();
              setMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
            role="menuitem"
          >
            Sign Out
          </button>
        </div>
      )}
      <style>{`
        @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Auth;