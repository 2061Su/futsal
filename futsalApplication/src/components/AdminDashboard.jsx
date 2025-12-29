import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NavBar from './NavBar';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [futsalRequests, setFutsalRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'verifications'

  const fetchData = async () => {
    try {
      
    // This MUST be /all to see Pending grounds
    const futsalRes = await axios.get('http://localhost:5000/api/futsals/all'); 
    console.log("Admin received:", futsalRes.data); // Open your browser console (F12) to check this!
    setFutsalRequests(futsalRes.data);
    
    const bookingRes = await axios.get('http://localhost:5000/api/bookings');
    setBookings(bookingRes.data);
  } catch (error) {
    console.error(error);
  }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle Booking Approval
  const handleBookingUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status: newStatus });
      toast.success(`Booking ${newStatus}`);
      fetchData();
    } catch (error) { toast.error("Update failed"); }
  };

  // Handle Futsal Ground Verification (Approve/Reject)
  const handleFutsalVerify = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/futsals/verify/${id}`, { status: newStatus });
      toast.success(`Ground ${newStatus}`);
      fetchData();
    } catch (error) { toast.error("Verification failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">System Administration</h2>

        {/* --- TABS NAVIGATION --- */}
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`pb-2 px-4 font-semibold transition ${activeTab === 'bookings' ? 'border-b-4 border-green-600 text-green-700' : 'text-gray-500'}`}
          >
            Manage Bookings
          </button>
          <button 
            onClick={() => setActiveTab('verifications')}
            className={`pb-2 px-4 font-semibold transition ${activeTab === 'verifications' ? 'border-b-4 border-green-600 text-green-700' : 'text-gray-500'}`}
          >
            Ground Verifications ({futsalRequests.filter(f => f.status === 'Pending').length})
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {activeTab === 'bookings' ? (
            /* --- BOOKINGS TABLE --- */
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">User / Contact</th>
                  <th className="p-4 font-semibold text-gray-600">Futsal</th>
                  <th className="p-4 font-semibold text-gray-600">Date & Time</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{b.User?.name}</div>
                      <a href={`tel:${b.User?.phone}`} className="text-sm text-blue-600 hover:underline">📞 {b.User?.phone || 'No phone'}</a>
                    </td>
                    <td className="p-4 font-medium">{b.Futsal?.name}</td>
                    <td className="p-4 text-sm">{b.date} <br/> <span className="text-xs text-gray-500">{b.timeSlot}</span></td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {b.status === 'Pending' && (
                        <>
                          <button onClick={() => handleBookingUpdate(b.id, 'Confirmed')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Approve</button>
                          <button onClick={() => handleBookingUpdate(b.id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* --- VERIFICATION TABLE --- */
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Futsal Name</th>
                  <th className="p-4 font-semibold text-gray-600">Location & Contact</th>
                  <th className="p-4 font-semibold text-gray-600">Price</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {futsalRequests.length > 0 ? futsalRequests.map(f => (
                  <tr key={f.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{f.name}</td>
                    <td className="p-4 text-sm text-gray-600">
                      📍 {f.location} <br/> 📞 {f.contact}
                    </td>
                    <td className="p-4 font-medium text-gray-800">Rs. {f.pricePerHour}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        f.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        f.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {f.status === 'Pending' ? (
                        <>
                          <button onClick={() => handleFutsalVerify(f.id, 'Approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Verify</button>
                          <button onClick={() => handleFutsalVerify(f.id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Decline</button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Completed</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No futsal registration requests found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;