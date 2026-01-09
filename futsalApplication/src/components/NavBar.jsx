
import React, { useState } from 'react';


import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole'); 

  // Helper to check active route for styling
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      setIsLoggingOut(true);

      toast.loading("Logging out...", { id: "logout-toast" });

      setTimeout(() => {
        localStorage.clear();
        toast.success("See you next time!", { 
          id: "logout-toast", 
          duration: 3000 
        });

        setIsLoggingOut(false);
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex justify-between items-center shadow-sm">
      
      {/* BRAND LOGO */}
      <Link 
        to={userRole === 'FutsalAdmin' ? "/owner-dashboard" : "/player-dashboard"} 
        className="flex items-center gap-2 group"
      >
        <div className="bg-emerald-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
          <span className="text-xl">⚽</span>
        </div>
        <span className="text-xl font-black text-slate-900 tracking-tighter">
          Futsal<span className="text-emerald-600">Connect</span>
        </span>
      </Link>
      
      {/* NAVIGATION LINKS */}
      <div className="hidden md:flex items-center gap-8">
        {userRole === 'Player' && (
          <>
            <Link 
              to="/player-dashboard" 
              className={`text-sm font-bold transition-colors ${isActive('/player-dashboard') ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Discover
            </Link>
            <Link 
              to="/my-bookings" 
              className={`text-sm font-bold transition-colors ${isActive('/my-bookings') ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              My Bookings
            </Link>
          </>
        )}

        {userRole === 'FutsalAdmin' && (
          <Link 
            to="/owner-dashboard" 
            className={`text-sm font-bold transition-colors ${isActive('/owner-dashboard') ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Management
          </Link>
        )}

        <Link 
          to="/profile" 
          className={`text-sm font-bold transition-colors ${isActive('/profile') ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Profile
        </Link>
        
        {userRole === 'Admin' && (
          <Link 
            to="/admin-dashboard" 
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            System Admin
          </Link>
        )}
      </div>

      {/* USER ACTIONS */}
      <div className="flex items-center gap-5">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Logged in as</span>
          <span className="text-sm font-bold text-slate-700">{userName}</span>
        </div>

        <button 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          className={`h-10 px-5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
            isLoggingOut 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100'
          }`}
        >
          {isLoggingOut ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              Exit
            </div>
          ) : (
            'Logout'
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;