import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
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

      const response = await axios.get('http://localhost:5000/api/futsals');
      setFutsals(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load futsal grounds");
    } finally {
      setLoading(false);
    }
  };


  const filteredFutsals = futsals.filter(futsal => 
    futsal.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    futsal.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Toaster />

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Find Your Pitch</h2>
          <p className="text-slate-500 mt-2 font-medium text-lg">Book the best futsal grounds in your city instantly.</p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search by name (e.g. 'Goal Arena')..." 
              className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all group-hover:border-slate-300"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-4.5 text-xl opacity-40">🔍</span>
          </div>
          
          <div className="relative md:w-72 group">
            <select 
              className="w-full p-4 pl-10 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer appearance-none transition-all group-hover:border-slate-300 font-semibold text-slate-700"
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
            </select>
            <span className="absolute left-4 top-4.5 text-lg opacity-40">📍</span>
            <span className="absolute right-4 top-5 text-xs opacity-40">▼</span>
          </div>
        </div>

        {/* Futsal Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-200 border-t-emerald-600"></div>
            <p className="text-slate-500 font-bold animate-pulse">Scouting grounds...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFutsals.map((futsal) => (
              <div 
                key={futsal.id} 
                className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-emerald-200/40 transition-all duration-500 overflow-hidden flex flex-col border border-slate-100 group cursor-pointer"
                onClick={() => navigate(`/book/${futsal.id}`)}
              >
                {/* IMAGE SECTION */}
                <div className="h-60 w-full overflow-hidden bg-slate-200 relative">
                  <img 
                    src={futsal.imageUrl} 
                    alt={futsal.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Futsal+Ground' }}
                  />
                  {/* Status Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm uppercase tracking-[0.15em] border border-white/50">
                    Verified Pitch
                  </div>
                  {/* Price Overlay */}
                  <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-2xl text-sm font-black shadow-lg shadow-emerald-900/20">
                    Rs. {futsal.pricePerHour}
                    <span className="text-[10px] font-normal opacity-80 ml-1">/hr</span>
                  </div>
                </div>

                {/* DETAILS SECTION */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                      {futsal.name}
                    </h3>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-6 flex items-center font-bold">
                    <span className="mr-1 text-emerald-500">📍</span> {futsal.location}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Timing</p>
                      <p className="text-xs font-bold text-slate-700">{futsal.openingTime} - {futsal.closingTime}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Contact</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{futsal.contact}</p>
                    </div>
                  </div>

                  <button 
                    className="mt-auto w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group/btn"
                  >
                    View Schedule
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFutsals.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-inner mt-10">
            <div className="text-6xl mb-6 grayscale opacity-20">🏟️</div>
            <p className="text-slate-800 text-xl font-black">No Grounds Found</p>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium">We couldn't find any verified grounds in "{locationFilter || 'this area'}" matching your search.</p>
            <button 
              onClick={() => {setSearchTerm(''); setLocationFilter('');}}
              className="mt-6 text-emerald-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;