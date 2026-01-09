import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import NavBar from './NavBar';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [futsalRequests, setFutsalRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const futsalRes = await axios.get('http://localhost:5000/api/futsals/all');
      setFutsalRequests(futsalRes.data);

      const bookingRes = await axios.get('http://localhost:5000/api/bookings');
      setBookings(bookingRes.data);
    } catch (error) {
      console.error("Admin Fetch Error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const filteredBookings = bookings.filter(b => 
    b.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.User?.phone?.includes(searchTerm) ||
    b.Futsal?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = futsalRequests.filter(f => 
    f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.contact?.includes(searchTerm) ||
    f.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleBookingUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status: newStatus });
      toast.success(`Booking ${newStatus} successfully`);
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleFutsalVerify = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/futsals/verify/${id}`, { status: newStatus });
      toast.success(`Ground ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error("Verification failed");
    }
  };


  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        toast.success("Booking deleted");
        fetchData(); 
      } catch (error) {
        toast.error("Deletion failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <Toaster />
      
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <header className="mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Control Panel</h2>
          <p className="text-slate-500 mt-2 font-medium">Manage ground verifications and system-wide bookings.</p>
        </header>

        {/* STATS SUMMARY (Optional but looks great) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-3xl font-black text-slate-800">{bookings.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending Grounds</p>
            <h3 className="text-3xl font-black text-emerald-600">
              {futsalRequests.filter(f => f.status === 'Pending').length}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Grounds</p>
            <h3 className="text-3xl font-black text-blue-600">
              {futsalRequests.filter(f => f.status === 'Approved').length}
            </h3>
          </div>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'bookings' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('verifications')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'verifications' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Verifications
            </button>
          </div>

          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Filter records..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm shadow-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-3.5 opacity-40 text-xl">🔍</span>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'bookings' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">User / Contact</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Futsal</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Schedule</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-slate-800">{b.User?.name}</p>
                        <p className="text-xs text-emerald-600 font-semibold">{b.User?.phone}</p>
                      </td>
                      <td className="p-5 font-semibold text-slate-700">{b.Futsal?.name}</td>
                      <td className="p-5 text-sm">
                        <span className="block font-medium text-slate-800">{b.date}</span>
                        <span className="text-xs text-slate-400 font-bold">{b.timeSlot}</span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          {b.status === 'Pending' && (
                            <>
                              <button onClick={() => handleBookingUpdate(b.id, 'Confirmed')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all">✓</button>
                              <button onClick={() => handleBookingUpdate(b.id, 'Rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">✕</button>
                            </>
                          )}
                          <button onClick={() => handleDeleteBooking(b.id)} className="px-3 py-2 text-xs font-bold bg-slate-100 text-slate-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Ground Detail</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Location</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Rate</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRequests.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-5 flex items-center gap-4">
                        <img src={f.imageUrl} className="w-14 h-10 rounded-lg object-cover bg-slate-100 shadow-sm" alt="" />
                        <div>
                          <p className="font-bold text-slate-800">{f.name}</p>
                          <p className="text-xs text-slate-400">{f.contact}</p>
                        </div>
                      </td>
                      <td className="p-5 text-sm font-medium text-slate-600">📍 {f.location}</td>
                      <td className="p-5 text-sm font-bold text-slate-800">Rs. {f.pricePerHour}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          f.status === 'Approved' ? 'bg-blue-100 text-blue-700' : 
                          f.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="p-5">
                        {f.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleFutsalVerify(f.id, 'Approved')} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all">Approve</button>
                            <button onClick={() => handleFutsalVerify(f.id, 'Rejected')} className="px-4 py-2 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all">Decline</button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase italic">Review Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;