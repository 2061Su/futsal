import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from './NavBar';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New State for Editing
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ date: '', timeSlot: '' });

  const userId = localStorage.getItem('userId');

  const ALL_TIME_SLOTS = [
  "06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM",
  "09:00 PM - 10:00 PM"
];

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

  // New Update Logic
  const handleUpdate = async (id) => {
  console.log("Sending PUT request to ID:", id); // Check console
  console.log("Data:", editData);

  try {
    const response = await axios.put(`http://localhost:5000/api/bookings/${id}`, editData);
    toast.success("Booking updated!");
    setEditingId(null);
    fetchMyBookings(); 
  } catch (error) {
    console.error("Axios Error:", error.response);
    toast.error(error.response?.data?.message || "Update failed");
  }
};
  const startEditing = (booking) => {
    setEditingId(booking.id);
    setEditData({ date: booking.date, timeSlot: booking.timeSlot });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Toaster />
      
      <div className="max-w-3xl mx-auto p-6 lg:p-10">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Match Schedule</h2>
          <p className="text-slate-500 font-medium mt-1">Keep track of your upcoming games.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-emerald-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div key={b.id} className="group bg-white rounded-4xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                <div className={`w-full md:w-3 ${b.status === 'Confirmed' ? 'bg-emerald-500' : b.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-400'}`} />

                <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="font-black text-2xl text-slate-800">🏟️ {b.Futsal?.name}</h3>
                    
                    {editingId === b.id ? (
                      /* EDIT MODE UI */
                      <div className="grid grid-cols-1 gap-3 mt-4">
                        <input 
                          type="date" 
                          className="p-2 border rounded-xl text-sm"
                          value={editData.date}
                          onChange={(e) => setEditData({...editData, date: e.target.value})}
                        />
                        <select 
                          className="p-2 border rounded-xl text-sm bg-white"
                          value={editData.timeSlot}
                          onChange={(e) => setEditData({...editData, timeSlot: e.target.value})}
                        >
                          
                          {ALL_TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdate(b.id)} className="bg-emerald-600 text-white px-4 py-1 rounded-lg text-xs font-bold">Save</button>
                          <button onClick={() => setEditingId(null)} className="bg-slate-200 px-4 py-1 rounded-lg text-xs font-bold">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Date</p>
                          <p className="text-sm font-bold text-slate-700">📅 {b.date}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</p>
                          <p className="text-sm font-bold text-slate-700">⏰ {b.timeSlot}</p>
                        </div>
                      </div>
                    )}

                    {b.status === 'Pending' && editingId !== b.id && (
                      <div className="flex gap-4 mt-6">
                        <button onClick={() => startEditing(b)} className="text-emerald-600 hover:text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <span>✎</span> Edit Details
                        </button>
                        <button onClick={() => handleCancel(b.id)} className="text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <span>✕</span> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-slate-50 border border-slate-100">
                    {b.status}
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