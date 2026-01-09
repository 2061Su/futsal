import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const UserResetP = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      toast.success("Password updated successfully!");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Toaster />
      <form onSubmit={handleReset} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-black mb-4">Set New Password</h2>
        <input 
          type="password" 
          placeholder="New Password" 
          className="w-full p-3 border rounded-xl mb-4" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Update Password</button>
      </form>
    </div>
  );
};

export default UserResetP;