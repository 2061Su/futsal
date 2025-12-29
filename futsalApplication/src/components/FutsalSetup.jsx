import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FutsalSetup = ({ onComplete }) => {
  // Use 'data' consistently
  const [data, setData] = useState({
    name: '', 
    location: '', 
    openingTime: '06:00 AM', 
    closingTime: '09:00 PM', 
    contact: '', 
    pricePerHour: ''
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ownerId = localStorage.getItem('userId');

    try {
      // Fixed: Accessing 'data' instead of 'formData'
      const response = await axios.post('http://localhost:5000/api/futsals/add', {
        name: data.name,
        location: data.location,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        contact: data.contact,
        pricePerHour: data.pricePerHour,
        ownerId: ownerId, 
        // status is handled by DB default (Pending)
      });

      toast.success("Ground submitted for review!");
      
      // Call the refresh function passed from OwnerDashboard
      if (onComplete) onComplete(); 
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto mt-10 border border-green-100">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Register Your Futsal</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">Submit your details for admin approval.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase">Futsal Name</label>
          <input type="text" placeholder="e.g. Arena Futsal" required className="w-full p-2 border rounded mt-1" 
            onChange={(e) => setData({...data, name: e.target.value})} />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase">Location</label>
          <select required className="w-full p-2 border rounded mt-1" onChange={(e) => setData({...data, location: e.target.value})}>
            <option value="">Select Location</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Bhaktapur">Bhaktapur</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Opening</label>
            <input type="text" placeholder="6 AM" className="w-full p-2 border rounded mt-1" 
              onChange={(e) => setData({...data, openingTime: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Closing</label>
            <input type="text" placeholder="9 PM" className="w-full p-2 border rounded mt-1" 
              onChange={(e) => setData({...data, closingTime: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 uppercase">Contact Number</label>
          <input type="text" placeholder="98XXXXXXXX" required className="w-full p-2 border rounded mt-1" 
            onChange={(e) => setData({...data, contact: e.target.value})} />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase">Price Per Hour (Rs.)</label>
          <input type="number" placeholder="1500" required className="w-full p-2 border rounded mt-1" 
            onChange={(e) => setData({...data, pricePerHour: e.target.value})} />
        </div>

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition shadow-lg mt-4">
          Submit for Approval
        </button>
      </form>
    </div>
  );
};

export default FutsalSetup;