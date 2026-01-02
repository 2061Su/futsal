import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NavBar from './NavBar';

const Profile = () => {
  const [user, setUser] = useState({ name: '', phone: '' });
  const [myFutsal, setMyFutsal] = useState(null); // Store ground data
  const [isEditingFutsal, setIsEditingFutsal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch User Data
      const userRes = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
      setUser({ name: userRes.data.name, phone: userRes.data.phone || '' });

      // 2. If Owner, Fetch their ground
      if (userRole === 'FutsalAdmin') {
        const futsalRes = await axios.get(`http://localhost:5000/api/futsals/owner/${userId}`);
        // Ensure you have a route in backend for this: GET /api/futsals/owner/:ownerId
        if (futsalRes.data) setMyFutsal(futsalRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, user);
      toast.success("Profile updated!");
      localStorage.setItem('userName', user.name);
    } catch (error) {
      toast.error("Profile update failed");
    }
  };

  const handleUpdateFutsal = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(myFutsal).forEach(key => formData.append(key, myFutsal[key]));
    if (imageFile) formData.append('image', imageFile);

    try {
      await axios.put(`http://localhost:5000/api/futsals/${myFutsal.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Ground details updated!");
      setIsEditingFutsal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update ground");
    }
  };

  const handleDeleteFutsal = async () => {
    if (window.confirm("Are you sure? This will remove your ground listing.")) {
      try {
        await axios.delete(`http://localhost:5000/api/futsals/${myFutsal.id}`);
        toast.success("Ground deleted");
        setMyFutsal(null);
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  if (loading) return <div className="text-center p-10">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        
        {/* LEFT: USER PROFILE SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-xl h-fit">
          <h2 className="text-2xl font-bold text-green-700 mb-6">User Details</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Full Name</label>
              <input type="text" className="w-full p-2 border rounded mt-1" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Phone</label>
              <input type="text" className="w-full p-2 border rounded mt-1" value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} />
            </div>
            <button className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition">Update User Info</button>
          </form>
        </div>

        {/* RIGHT: OWNER'S FUTSAL SECTION */}
        {userRole === 'FutsalAdmin' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Your Futsal</h2>
            
            {!myFutsal ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">You haven't registered a ground yet.</p>
                <button onClick={() => window.location.href='/owner-dashboard'} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Register Now</button>
              </div>
            ) : isEditingFutsal ? (
              /* EDIT FORM */
              <form onSubmit={handleUpdateFutsal} className="space-y-4">
                <input type="text" className="w-full p-2 border rounded" value={myFutsal.name} onChange={(e) => setMyFutsal({...myFutsal, name: e.target.value})} placeholder="Name" />
                <input type="number" className="w-full p-2 border rounded" value={myFutsal.pricePerHour} onChange={(e) => setMyFutsal({...myFutsal, pricePerHour: e.target.value})} placeholder="Price" />
                <input type="file" className="text-xs" onChange={(e) => setImageFile(e.target.files[0])} />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded font-bold">Save</button>
                  <button onClick={() => setIsEditingFutsal(false)} className="flex-1 bg-gray-400 text-white py-2 rounded font-bold">Cancel</button>
                </div>
              </form>
            ) : (
              /* VIEW MODE */
              <div>
                <img src={myFutsal.imageUrl} alt="Ground" className="w-full h-40 object-cover rounded-lg mb-4 shadow-sm" />
                <h3 className="text-xl font-bold text-gray-800">{myFutsal.name}</h3>
                <p className="text-sm text-gray-600 mb-4">📍 {myFutsal.location}</p>
                <div className={`text-xs font-bold inline-block px-3 py-1 rounded-full mb-4 ${myFutsal.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Status: {myFutsal.status}
                </div>
                
                <div className="flex gap-3">
                  <button onClick={() => setIsEditingFutsal(true)} className="flex-1 bg-blue-100 text-blue-700 py-2 rounded font-bold hover:bg-blue-200">Update Details</button>
                  <button onClick={handleDeleteFutsal} className="flex-1 bg-red-100 text-red-700 py-2 rounded font-bold hover:bg-red-200">Delete Ground</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;