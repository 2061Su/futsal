import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from './NavBar';



const PlayerDashboard = () => {
  const [futsals, setFutsals] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const navigate = useNavigate();

  // Get user info from localStorage (Set during login)
  const userName = localStorage.getItem('userName') || 'Player';
  

  useEffect(() => {
    fetchFutsals();
  }, []);

  const fetchFutsals = async () => {
    try {
      // 3. Ensure this matches your server address
      const response = await axios.get('http://localhost:5000/api/futsals');
      setFutsals(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load futsal grounds");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Filter Logic (User Stories 2 & 3)
  const filteredFutsals = futsals.filter(futsal => 
    futsal.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    futsal.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Search and Filter Section (User Stories 2 & 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Search by name (e.g. 'Goal Arena')..." 
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Bhaktapur">Bhaktapur</option>
          </select>
        </div>

        {/* Futsal Grid (User Stories 1, 4, 5, 14) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFutsals.map((futsal) => (
            <div key={futsal.id} className="bg-white rounded-xl shadow hover:shadow-xl transition p-5 border-t-4 border-green-600">
              <h3 className="text-xl font-bold text-gray-800">{futsal.name}</h3>
              <p className="text-gray-500 text-sm mb-3">📍 {futsal.location}</p>
              
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p>⏰ <strong>Hours:</strong> {futsal.openingTime} - {futsal.closingTime}</p>
                <p>📞 <strong>Contact:</strong> {futsal.contact}</p>
                <p className="text-green-700 font-bold text-lg">Rs. {futsal.pricePerHour} / hr</p>
              </div>

              <button 
                onClick={() => navigate(`/book/${futsal.id}`)}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        {filteredFutsals.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No futsal grounds found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;