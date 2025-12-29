import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const UserRegistration = () => {
  // 1. Added 'acceptedTerms' to state
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    acceptedTerms: false 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // 2. Client-side check for terms
    if (!formData.acceptedTerms) {
      toast.error('You must accept the Privacy Policy and Terms.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      toast.success('Registration Successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error("Full Error Object:", error.response?.data); 
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 my-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join the community and start booking pitches!</p>
        
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none transition"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none transition"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          
          <div className="flex items-start gap-2 py-2">
            <input 
              type="checkbox"
              id="terms"
              required
              className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
              checked={formData.acceptedTerms}
              onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})}
            />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I accept the <span className="text-green-600 hover:underline">Privacy Policy</span> and <span className="text-green-600 hover:underline">Terms & Conditions</span>.
            </label>
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md transition duration-300 shadow-md">
            Sign Up
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-green-600 hover:underline font-semibold">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;