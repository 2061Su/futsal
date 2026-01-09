import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const FutsalSetup = ({ onComplete }) => {
  
  const [data, setData] = useState({
    name: '', 
    location: '', 
    openingTime: '06:00 AM', 
    closingTime: '09:00 PM', 
    contact: '', 
    pricePerHour: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ownerId = localStorage.getItem('userId');
    const toastId = toast.loading("Uploading your venue details...");
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    formData.append('ownerId', ownerId);
    if (imageFile) formData.append('image', imageFile);

    try {

      await axios.post('http://localhost:5000/api/futsals/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Registration submitted! Our team will review it.", { id: toastId });
      if (onComplete) setTimeout(onComplete, 2000); 
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.", { id: toastId });
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <Toaster />
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-slate-100 overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="bg-slate-900 p-8 text-center">
          <div className="inline-block bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-emerald-500/30 mb-4">
            Partner Onboarding
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Register Your Venue</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">Join the network and start receiving match bookings.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          
          {/* SECTION 1: BASIC INFO */}
          <div className="space-y-5">
            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-2px bg-emerald-200"></span> Venue Identity
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                <input type="text" required placeholder="e.g. Anfield Futsal" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" 
                  onChange={(e) => setData({...data, name: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City/Location</label>
                <select required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 appearance-none" 
                  onChange={(e) => setData({...data, location: e.target.value})}>
                  <option value="">Select Region</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: PHOTO UPLOAD */}
          <div className="space-y-5">
             <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-emerald-200"></span> Visual Preview
            </p>
            
            <div className="relative group border-2 border-dashed border-slate-200 rounded-4xl p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50/30">
              {previewUrl ? (
                <div className="relative h-48 w-full">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-2xl shadow-md" />
                  <button type="button" onClick={() => setPreviewUrl(null)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600">✕</button>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                  <p className="text-sm font-black text-slate-600">Upload Court Image</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">JPG, PNG up to 5MB</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: PRICING & CONTACT */}
          <div className="space-y-5">
             <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-emerald-200"></span> Operations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-xs">Contact Number</label>
                <input type="text" required placeholder="98XXXXXXXX" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" 
                  onChange={(e) => setData({...data, contact: e.target.value})} />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-xs">Hourly Rate (NPR)</label>
                <input type="number" required placeholder="1500" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" 
                  onChange={(e) => setData({...data, pricePerHour: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 active:scale-[0.98]">
              Send for Approval
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-6 tracking-widest">
              By submitting, you agree to our venue partnership terms.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FutsalSetup;