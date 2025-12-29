import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FutsalSetup = ({ onComplete }) => {
  const [data, setData] = useState({
    name: '', location: '', openingTime: '06:00 AM', 
    closingTime: '09:00 PM', contact: '', pricePerHour: ''
  });
  const ownerId = localStorage.getItem('userId');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/futsals/add', { ...data, ownerId });
      toast.success("Futsal Registered Successfully!");
      onComplete(); // Refresh dashboard to show the owner's info
    } catch (error) {
      toast.error(error.response?.data?.message || "Setup failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Register Your Futsal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Futsal Name" required className="w-full p-2 border rounded" 
          onChange={(e) => setData({...data, name: e.target.value})} />
        
        <select className="w-full p-2 border rounded" onChange={(e) => setData({...data, location: e.target.value})}>
          <option value="">Select Location</option>
          <option value="Kathmandu">Kathmandu</option>
          <option value="Lalitpur">Lalitpur</option>
          <option value="Bhaktapur">Bhaktapur</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Opening (e.g. 6 AM)" className="p-2 border rounded" 
            onChange={(e) => setData({...data, openingTime: e.target.value})} />
          <input type="text" placeholder="Closing (e.g. 9 PM)" className="p-2 border rounded" 
            onChange={(e) => setData({...data, closingTime: e.target.value})} />
        </div>

        <input type="text" placeholder="Contact Number" className="w-full p-2 border rounded" 
          onChange={(e) => setData({...data, contact: e.target.value})} />
        
        <input type="number" placeholder="Price Per Hour (Rs.)" className="w-full p-2 border rounded" 
          onChange={(e) => setData({...data, pricePerHour: e.target.value})} />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold">
          List My Futsal
        </button>
      </form>
    </div>
  );
};

export default FutsalSetup;