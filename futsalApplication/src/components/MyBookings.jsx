import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from './NavBar'; 

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const userId = localStorage.getItem('userId');





  const fetchMyBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`);
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to load your matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchMyBookings();
    else setLoading(false);
  }, [userId]);


  const handleCancel = async (id) => {
    if (window.confirm("Do you want to withdraw this booking request?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        toast.success("Booking request withdrawn");
        setBookings(bookings.filter(b => b.id !== id));
      } catch (error) {
        toast.error("Action failed. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Toaster />
      
      <div className="max-w-3xl mx-auto p-6 lg:p-10">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Match Schedule</h2>
          <p className="text-slate-500 font-medium mt-1">Keep track of your upcoming games and pending requests.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-emerald-600"></div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Fetching your lineup...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 p-16 rounded-[2.5rem] text-center">
            <div className="text-5xl mb-4 grayscale opacity-30">👟</div>
            <p className="text-slate-800 text-xl font-black">No Matches Booked</p>
            <p className="text-slate-400 text-sm mt-2 font-medium mb-8">Your calendar is empty. Time to hit the pitch!</p>
            <button 
              onClick={() => window.location.href='/player-dashboard'}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:scale-105 transition-transform"
            >
              Find a Pitch
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div 
                key={b.id} 
                className="group bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row transition-all hover:border-emerald-200"
              >
                {/* STATUS STRIP */}
                <div className={`w-full md:w-3 flex md:flex-col ${
                  b.status === 'Confirmed' ? 'bg-emerald-500' : 
                  b.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-400'
                }`} />

                <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-2xl">🏟️</span>
                       <h3 className="font-black text-2xl text-slate-800 tracking-tight">
                         {b.Futsal?.name || 'Venue Unavailable'}
                       </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Match Date</p>
                        <p className="text-sm font-bold text-slate-700">📅 {b.date}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot</p>
                        <p className="text-sm font-bold text-slate-700">⏰ {b.timeSlot}</p>
                      </div>
                    </div>

                    {b.status === 'Pending' && (
                      <button 
                        onClick={() => handleCancel(b.id)}
                        className="mt-6 text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors group/cancel"
                      >
                        <span className="group-hover/cancel:rotate-90 transition-transform block">✕</span> 
                        Cancel Request
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full md:w-auto flex flex-col items-end gap-3">
                    <div className={`px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm border ${
                      b.status === 'Confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                      b.status === 'Rejected' ? 'bg-red-50 border-red-100 text-red-600' : 
                      'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      {b.status}
                    </div>
                    
                    {b.status === 'Confirmed' && (
                      <div className="hidden md:block">
                         <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                           Spot Secured
                         </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;