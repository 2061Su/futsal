import React, { useState } from 'react';
import axios from 'axios'; 
import { toast } from 'react-hot-toast'; 
import { useNavigate, Link } from 'react-router-dom'; 

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Save user data to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userName', response.data.user.name);
      localStorage.setItem('userId', response.data.user.id);

      toast.success(`Welcome back, ${response.data.user.name}!`);

      // Artificial delay of 1.5 seconds for a smoother feel
      setTimeout(() => {
        const role = response.data.user.role;
        if (role === 'Player') {
          navigate('/player-dashboard');
        } else if (role === 'FutsalAdmin') {
          navigate('/owner-dashboard');
        } else if (role === 'Admin') {
          navigate('/admin-dashboard');
        }
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      setIsLoading(false); // Stop loading on error
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
              disabled={isLoading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none disabled:bg-gray-100"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" size="small" className="text-xs text-green-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input 
              type="password" 
              required
              disabled={isLoading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none disabled:bg-gray-100"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full font-bold py-2 rounded-md transition shadow-md flex justify-center items-center gap-2 ${
              isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : 'Login'}
          </button>
        </form>


        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-600 font-bold hover:underline">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;