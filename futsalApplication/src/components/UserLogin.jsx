import React, { useState } from 'react';
import axios from 'axios'; 
import { toast } from 'react-hot-toast'; 
import { useNavigate, Link } from 'react-router-dom'; 
import Logo from '../assets/Logo.png'; // Importing your logo

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

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
      setIsLoading(false);
      toast.error(error.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 overflow-hidden mb-4">
             <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 font-medium">Please enter your details</p>
        </div>

        {/* Card Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                disabled={isLoading}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all disabled:opacity-50"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" size="small" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                  Forgot Password?
                </Link>
              </div>
              <input 
                type="password" 
                required
                disabled={isLoading}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] shadow-lg flex justify-center items-center gap-3 ${
                isLoading 
                ? 'bg-emerald-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500 font-medium">New to the platform?</span>{' '}
            <Link to="/signup" className="text-emerald-600 font-bold hover:underline ml-1">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;