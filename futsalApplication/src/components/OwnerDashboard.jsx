import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import NavBar from './NavBar';
import FutsalSetup from './FutsalSetup';

const OwnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [myFutsal, setMyFutsal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const userId = localStorage.getItem('userId');

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      if (!userId) return;

      const futsalRes = await axios.get('http://localhost:5000/api/futsals/all');
      
      if (futsalRes.data && Array.isArray(futsalRes.data)) {
        const myGround = futsalRes.data.find(f => String(f.ownerId) === String(userId));
        
        if (myGround) {
          setMyFutsal(myGround);
          const bookingRes = await axios.get(`http://localhost:5000/api/bookings/futsal/${myGround.id}`);
          setBookings(Array.isArray(bookingRes.data) ? bookingRes.data : []);
        } else {
          setMyFutsal(null);
        }
      }
    } catch (error) {
      console.error("Owner Dashboard Error:", error);
      if (error.response?.status !== 404) {
        toast.error("Dashboard sync failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchOwnerData();
  }, [userId]);

  
  const filteredBookings = bookings.filter(b => 
    b.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.User?.phone?.includes(searchTerm)
  );

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}`);
      fetchOwnerData(); 
    } catch (error) {
      toast.error("Update failed");
    }
  };


  const handleDeleteBooking = async (id) => {
    if (window.confirm("Do you want to delete this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        toast.success("Booking deleted");
        fetchOwnerData();
      } catch (error) {
        toast.error("Deletion failed");
      }
    }
  };

  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const totalRevenue = confirmedBookings.length * (myFutsal?.pricePerHour || 0);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-600"></div>
      <p className="text-slate-500 font-bold animate-pulse tracking-tight">Syncing your venue...</p>
    </div>
  );

  if (!myFutsal) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="max-w-4xl mx-auto py-16 px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, Partner!</h1>
            <p className="text-slate-500 mt-3 font-medium text-lg">Let's get your ground listed and start receiving bookings.</p>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-2">
            <FutsalSetup onComplete={fetchOwnerData} />
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <Toaster />
      
      <div className="max-w-7xl mx-auto p-6 lg:p-10">

        {myFutsal.status === 'Pending' && (
          <div className="bg-amber-50 border border-amber-100 p-4 mb-10 rounded-2xl flex items-center gap-4">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-sm text-amber-800 font-bold uppercase tracking-wider">Under Review</p>
              <p className="text-amber-700 text-sm">Our team is verifying your ground details. You can manage bookings once approved.</p>
            </div>
          </div>
        )}

        {/* Header & Stats Card */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-200">
              🏟️
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{myFutsal.name}</h1>
              <p className="text-slate-400 font-bold text-sm flex items-center gap-1">
                <span className="text-emerald-500">📍</span> {myFutsal.location} • Rs. {myFutsal.pricePerHour}/hr
              </p>
            </div>
          </div>
          

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-white p-5 rounded-4xl shadow-sm border border-slate-100 min-w-40">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Revenue</p>
              <p className="text-2xl font-black text-slate-800">Rs. {totalRevenue}</p>
            </div>
            <div className="bg-white p-5 rounded-4xl shadow-sm border border-slate-100 min-w-40">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Slots</p>
              <p className="text-2xl font-black text-slate-800">{bookings.length}</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
           <h3 className="text-xl font-extrabold text-slate-800">Booking Management</h3>
           <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-3.5 opacity-30">🔍</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-400">Customer Details</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-400">Time & Date</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="p-6">
                        <p className="font-bold text-slate-800">{b.User?.name}</p>
                        <p className="text-xs font-semibold text-emerald-600">{b.User?.phone}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold text-slate-700">{b.date}</p>
                        <p className="text-xs font-medium text-slate-400 uppercase">{b.timeSlot}</p>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                          b.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          {b.status === 'Pending' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleStatusUpdate(b.id, 'Confirmed')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(b.id, 'Rejected')}
                                className="bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleDeleteBooking(b.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-2"
                              title="Remove Record"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-20 text-center">
                      <p className="text-slate-300 font-bold text-lg">No bookings found</p>
                      <p className="text-slate-400 text-sm mt-1">When players book your ground, they will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;