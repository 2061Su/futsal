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

  useEffect(() => {
    fetchFutsals();
  }, []);

  const fetchFutsals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/futsals');
      setFutsals(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load futsal grounds");
    }
  };

  const filteredFutsals = futsals.filter(futsal => 
    futsal.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    futsal.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Search and Filter Section */}
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

        {/* Futsal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFutsals.map((futsal) => (
            <div key={futsal.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
              
              {/* IMAGE SECTION */}
              <div className="h-48 w-full overflow-hidden bg-gray-200 relative">
                <img 
                  src={futsal.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image+Available'} 
                  alt={futsal.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {/* Price Badge Overlay */}
                <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  Rs. {futsal.pricePerHour}/hr
                </div>
              </div>

              {/* DETAILS SECTION */}
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{futsal.name}</h3>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 flex items-center">
                  <span className="mr-1">📍</span> {futsal.location}
                </p>
                
                <div className="space-y-2 text-sm text-gray-700 mb-6 bg-gray-50 p-3 rounded-lg">
                  <p className="flex justify-between">
                    <span className="text-gray-500">⏰ Hours:</span> 
                    <span className="font-medium">{futsal.openingTime} - {futsal.closingTime}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">📞 Contact:</span> 
                    <span className="font-medium">{futsal.contact}</span>
                  </p>
                </div>

                <button 
                  onClick={() => navigate(`/book/${futsal.id}`)}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFutsals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 mt-10">
            <p className="text-gray-400 text-lg">No futsal grounds found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;