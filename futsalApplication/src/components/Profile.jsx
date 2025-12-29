import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NavBar from './NavBar';

const Profile = () => {
  const [user, setUser] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // You might need to create this specific route in authRoutes or use a generic one
        const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
        setUser({
          name: response.data.name,
          phone: response.data.phone || ''
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, user);
      toast.success("Profile updated successfully!");
      localStorage.setItem('userName', user.name); // Update name in storage too
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div className="text-center p-10">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Your Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg outline-green-500"
              value={user.name} 
              onChange={(e) => setUser({...user, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
            <input 
              type="text"
              placeholder="e.g. 98XXXXXXXX"
              className="w-full p-2 border border-gray-300 rounded-lg outline-green-500"
              value={user.phone} 
              onChange={(e) => setUser({...user, phone: e.target.value})} 
            />
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-md">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;