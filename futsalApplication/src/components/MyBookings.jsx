import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Added toast import
import Navbar from './NavBar'; 

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the real logged-in user ID
  const userId = localStorage.getItem('userId');

  useEffect(() => {
  const userIdFromStorage = localStorage.getItem('userId'); // Get it fresh here
  
  if (!userIdFromStorage) {
    console.error("No User ID found in storage!");
    setLoading(false);
    return;
  }

  const fetchMyBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/user/${userIdFromStorage}`);
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  fetchMyBookings();
}, []);

  // NEW: Cancel Function
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        toast.success("Booking Cancelled");
        // Remove the cancelled booking from the UI immediately
        setBookings(bookings.filter(b => b.id !== id));
      } catch (error) {
        toast.error("Failed to cancel booking");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Bookings</h2>

        {loading ? (
          <p>Loading your matches...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="p-5 bg-white shadow-sm rounded-xl border-l-8 border-green-600 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl text-green-800">{b.Futsal?.name || 'Unknown Futsal'}</h3>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>📅 <span className="font-semibold">Date:</span> {b.date}</p>
                    <p>⏰ <span className="font-semibold">Time:</span> {b.timeSlot}</p>
                  </div>

                  {/* INSERTED CANCEL BUTTON HERE */}
                  {b.status === 'Pending' && (
                    <button 
                      onClick={() => handleCancel(b.id)}
                      className="mt-4 text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 transition"
                    >
                      🗑️ Cancel Request
                    </button>
                  )}
                </div>
                
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider ${
                    b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {b.status}
                  </span>
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