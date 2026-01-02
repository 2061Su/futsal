import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from './NavBar';



const PlayerDashboard = () => {
  const [futsals, setFutsals] = useState([]);


  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchFutsals();
  }, []);

  const fetchFutsals = async () => {
    try {
      setLoading(true);
      // This route (/) only fetches futsals where status = 'Approved'
      const response = await axios.get('http://localhost:5000/api/futsals');
      setFutsals(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load futsal grounds");
    } finally {
      setLoading(false);
    }
  };

  // Filter the already approved futsals based on user search/location
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
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by name (e.g. 'Goal Arena')..." 
              className="w-full p-3 pl-10 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 shadow-sm bg-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
          
          <select 
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 shadow-sm bg-white cursor-pointer"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Bhaktapur">Bhaktapur</option>
          </select>
        </div>

        {/* Futsal Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFutsals.map((futsal) => (
              <div key={futsal.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 group">
                
                {/* IMAGE SECTION */}
                <div className="h-52 w-full overflow-hidden bg-gray-200 relative">
                  <img 
                    src={futsal.imageUrl} 
                    alt={futsal.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=No+Image+Available' }}
                  />
                  {/* Price Badge Overlay */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 px-3 py-1 rounded-full text-xs font-black shadow-sm uppercase tracking-wider">
                    Verified
                  </div>
                  <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Rs. {futsal.pricePerHour}/hr
                  </div>
                </div>

                {/* DETAILS SECTION */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{futsal.name}</h3>
                  
                  <p className="text-gray-500 text-sm mb-4 flex items-center">
                    <span className="mr-1">📍</span> {futsal.location}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-700 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="flex justify-between">
                      <span className="text-gray-500 font-medium">Available:</span> 
                      <span className="font-bold text-gray-800">{futsal.openingTime} - {futsal.closingTime}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500 font-medium">Contact:</span> 
                      <span className="font-bold text-green-700">{futsal.contact}</span>
                    </p>
                  </div>

                  <button 
                    onClick={() => navigate(`/book/${futsal.id}`)}
                    className="mt-auto w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Check Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFutsals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 mt-10">
            <div className="text-5xl mb-4">🏟️</div>
            <p className="text-gray-500 text-lg font-medium">No verified futsal grounds found here yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back later or try a different search!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;