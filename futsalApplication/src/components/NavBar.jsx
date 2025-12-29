// src/components/NavBar.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole'); 

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      setIsLoggingOut(true);
      // We keep the ID here to replace the "Loading" state
      toast.loading("Logging out...", { id: "logout-toast" });

      setTimeout(() => {
        localStorage.clear();
        
        // 1. Success message - give it a duration or it won't vanish!
        toast.success("Logged out successfully", { 
          id: "logout-toast", 
          duration: 3000 // 3 seconds
        });

        setIsLoggingOut(false);
        navigate('/login');
      }, 1500);
    }
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">

      <Link 
        to={userRole === 'FutsalAdmin' ? "/owner-dashboard" : "/player-dashboard"} 
        className="text-2xl font-bold italic"
      >
        FutsalConnect
      </Link>
      
      <div className="flex items-center gap-6">
        <div className="flex gap-4 items-center">

          {userRole === 'Player' && (
            <>
              <Link to="/player-dashboard" className="hover:text-green-200 text-sm font-semibold">Home</Link>
              <Link to="/my-bookings" className="hover:text-green-200 text-sm font-semibold">My Bookings</Link>
            </>
          )}

          <Link to="/profile" className="hover:text-green-200 text-sm font-semibold">
            Profile
          </Link>

          
          {userRole === 'Admin' && (
            <Link to="/admin-dashboard" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-bold">
              System Admin
            </Link>
          )}


          {userRole === 'FutsalAdmin' && (
            <Link to="/owner-dashboard" className="bg-green-800 hover:bg-green-900 px-3 py-1 rounded text-sm font-bold">
              My Futsal Panel
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 border-l pl-4 border-green-600">
          <span className="hidden md:block text-sm">Welcome, {userName}</span>
          
          {/* Logout Button with Loading State */}
          <button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className={`px-4 py-1 rounded text-sm transition flex items-center gap-2 ${
              isLoggingOut ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;