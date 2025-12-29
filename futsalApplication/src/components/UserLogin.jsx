import React, { useState } from 'react';
import axios from 'axios'; 
import { toast, Toaster } from 'react-hot-toast'; 
import { useNavigate, Link } from 'react-router-dom'; 

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userName', response.data.user.name);
      localStorage.setItem('userId', response.data.user.id);

      toast.success(`Welcome back, ${response.data.user.name}!`);

      // Role-based redirection
      if (response.data.user.role === 'Player') {
        navigate('/player-dashboard');
      } else if (response.data.user.role === 'FutsalAdmin') {
        navigate('/admin-dashboard');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
     
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Login</h2>
        
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              {/* Forgot Password Link */}
              <Link to="/forgot-password" title="Forgot Password" className="text-xs text-green-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input 
              type="password" 
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md transition shadow-md">
            Login
          </button>
        </form>

        {/* Link to Signup */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" title="Create Account" className="text-green-600 font-bold hover:underline">
            Register as Player
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;