import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NavBar from './NavBar';
import FutsalSetup from './FutsalSetup';

const OwnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [myFutsal, setMyFutsal] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchOwnerData = async () => {
  try {
    setLoading(true);
    if (!userId) return;

    const futsalRes = await axios.get('http://localhost:5000/api/futsals/all');
    
    // Safety check: Ensure data is an array before calling .find()
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
    // Only show toast if it's a real error, not just a 404 (no ground yet)
    if (error.response?.status !== 404) {
      toast.error("Dashboard sync failed. Check server connection.");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (userId) fetchOwnerData();
  }, [userId]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}`);
      fetchOwnerData(); // Refresh data
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // Calculate total revenue from Confirmed bookings
  const totalRevenue = bookings
    .filter(b => b.status === 'Confirmed')
    .length * (myFutsal?.pricePerHour || 0);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Owner Space...</div>;

  // STEP 1: If owner hasn't registered a futsal yet
  if (!myFutsal) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, Partner!</h1>
            <p className="text-gray-600 mt-2">To start receiving bookings, please list your futsal ground details below.</p>
          </div>
          <FutsalSetup onComplete={fetchOwnerData} />
        </div>
      </div>
    );
  }

  // STEP 2: If owner has a futsal, show the management dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto p-6">

        {myFutsal.status === 'Pending' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-semibold">
                  Under Review: <span className="font-normal text-yellow-600">Your ground is currently being reviewed by the Admin. It will be visible to players once approved.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{myFutsal.name} Dashboard</h1>
            <p className="text-gray-500">📍 {myFutsal.location} | Rs. {myFutsal.pricePerHour}/hr</p>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 w-40">
              <p className="text-xs text-gray-500 uppercase font-bold">Total Revenue</p>
              <p className="text-xl font-bold text-gray-800">Rs. {totalRevenue}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 w-40">
              <p className="text-xs text-gray-500 uppercase font-bold">Total Bookings</p>
              <p className="text-xl font-bold text-gray-800">{bookings.length}</p>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700">Recent Booking Requests</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Schedule</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{b.User?.name}</p>
                        <a href={`tel:${b.User?.phone}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          📞 {b.User?.phone || 'No Phone'}
                        </a>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-800 font-medium">{b.date}</p>
                        <p className="text-xs text-gray-500">{b.timeSlot}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                          b.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {b.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(b.id, 'Confirmed')}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(b.id, 'Rejected')}
                              className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Decision Made</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400">
                      No bookings found for your ground yet.
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