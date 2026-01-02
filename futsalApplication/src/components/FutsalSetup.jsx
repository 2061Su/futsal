import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FutsalSetup = ({ onComplete }) => {
  
  const [data, setData] = useState({
    name: '', 
    location: '', 
    openingTime: '06:00 AM', 
    closingTime: '09:00 PM', 
    contact: '', 
    pricePerHour: ''
  });
  
  // New state for the image file
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ownerId = localStorage.getItem('userId');

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('location', data.location);
    formData.append('openingTime', data.openingTime);
    formData.append('closingTime', data.closingTime);
    formData.append('contact', data.contact);
    formData.append('pricePerHour', data.pricePerHour);
    formData.append('ownerId', ownerId);
    
    // Append the image file if it exists
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // Important: headers must allow multipart/form-data
      await axios.post('http://localhost:5000/api/futsals/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Ground submitted for review!");


      if (onComplete) onComplete(); 
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto mt-10 border border-green-100">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Register Your Futsal</h2>
      

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... existing text inputs remain same ... */}
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase">Futsal Name</label>
          <input type="text" required className="w-full p-2 border rounded mt-1" 
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

        {/* NEW: Image Upload Field */}
        <div className="bg-green-50 p-4 rounded-lg border-2 border-dashed border-green-200">
          <label className="text-xs font-bold text-gray-600 uppercase block mb-2">Ground Photo</label>
          <input 
            type="file" 
            accept="image/*"
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <p className="text-[10px] text-gray-400 mt-2 italic">Upload a clear photo of your court (JPG/PNG)</p>
        </div>

        {/* ... other inputs like price, contact ... */}
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase">Contact Number</label>
          <input type="text" required className="w-full p-2 border rounded mt-1" 
            onChange={(e) => setData({...data, contact: e.target.value})} />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase">Price Per Hour (Rs.)</label>
          <input type="number" required className="w-full p-2 border rounded mt-1" 
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