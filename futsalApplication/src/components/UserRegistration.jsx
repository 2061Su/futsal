import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/Logo.png'; // Importing your logo

const UserRegistration = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'Player', 
    acceptedTerms: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.acceptedTerms) {
      toast.error('You must accept the Privacy Policy and Terms.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role 
      });
      
      toast.success('Registration Successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Toaster />
      <div className="max-w-md w-full">
        {/* Logo & Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 overflow-hidden mb-4">
             <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">Join the futsal community today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="name@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Register as:</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Player">Player (I want to book)</option>
                <option value="FutsalAdmin">Futsal Owner (I want to list my ground)</option>
              </select>
            </div>

            <div className="flex items-start gap-3 py-1">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                checked={formData.acceptedTerms} 
                onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})} 
              />
              <label htmlFor="terms" className="text-xs text-slate-500 leading-normal">
                I accept the <span className="text-emerald-600 font-bold">Privacy Policy</span> and <span className="text-emerald-600 font-bold">Terms & Conditions</span>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] shadow-lg flex justify-center items-center gap-2 ${
                isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;