import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
// --- IMPORT LOGO ---
import Logo from '../assets/Logo.png'; 

const UserForgetP = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      
      toast.success(response.data.message || 'Reset link sent to your email!');
      setEmail(''); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Toaster />
      <div className="max-w-md w-full">
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 overflow-hidden mb-4">
             <img src={Logo} alt="Futsal Logo" className="w-full h-full object-cover p-1" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Forgot Password?</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium px-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* CARD SECTION */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <form className="space-y-6" onSubmit={handleResetRequest}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                disabled={loading}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all disabled:opacity-50"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] shadow-lg flex justify-center items-center gap-3 ${
                loading 
                ? 'bg-emerald-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Link...
                </>
              ) : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center justify-center gap-2 transition group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForgetP;