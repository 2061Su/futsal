import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const UserRegistration = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'Player', // Default role
    acceptedTerms: false 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.acceptedTerms) {
      toast.error('You must accept the Privacy Policy and Terms.');
      return;
    }

    try {
      // Send name, email, password AND role to the backend
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role 
      });
      
      toast.success('Registration Successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 my-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Create Account</h2>
        
        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Name, Email, Password inputs stay the same... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md" 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md" 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md" 
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          {/* --- NEW ROLE SELECTION --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Register as:</label>
            <select 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 outline-none"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Player">Player (I want to book)</option>
              <option value="FutsalAdmin">Futsal Owner (I want to list my ground)</option>
            </select>
          </div>

          <div className="flex items-start gap-2 py-2">
            <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 text-green-600"
              checked={formData.acceptedTerms} onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})} />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I accept the Privacy Policy and Terms & Conditions.
            </label>
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md transition shadow-md">
            Sign Up
          </button>
        </form>
        {/* Login Link stays the same... */}
      </div>
    </div>
  );
};

export default UserRegistration;