// src/components/NavBar.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  
  // Get the role to see if they should see the Admin link
  const userRole = localStorage.getItem('userRole'); 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/player-dashboard" className="text-2xl font-bold italic">
        FutsalConnect
      </Link>
      
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <Link to="/player-dashboard" className="hover:text-green-200 text-sm font-semibold">Home</Link>
          <Link to="/my-bookings" className="hover:text-green-200 text-sm font-semibold">My Bookings</Link>

          <Link to="/profile" className="hover:text-green-200 text-sm font-semibold">
            Profile
          </Link>
          
          {userRole === 'FutsalAdmin' && (
          <Link to="/admin-dashboard" className="bg-green-800 px-3 py-1 rounded">
            Admin Panel
          </Link>
        )}
        </div>

        <div className="flex items-center gap-4 border-l pl-4 border-green-600">
          <span className="hidden md:block text-sm">Welcome, {userName}</span>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm transition">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;