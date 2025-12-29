import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-4">Forgot Password?</h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <form className="space-y-6" onSubmit={handleResetRequest}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md transition shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-green-600 font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserForgetP;