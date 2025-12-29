import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NavBar from './NavBar';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);

  const fetchAllBookings = async () => {
    const res = await axios.get('http://localhost:5000/api/bookings');
    setBookings(res.data);
  };

  useEffect(() => { fetchAllBookings(); }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status: newStatus });
      toast.success(`Booking ${newStatus}`);
      fetchAllBookings(); // Refresh the list
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Manage Bookings</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                {/* 1. Change Label to include Contact */}
                <th className="p-4 font-semibold">User / Contact</th>
                <th className="p-4 font-semibold">Futsal</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  {/* 2. Display Name AND Phone Number */}
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{b.User?.name}</div>
                    <div className="text-sm text-blue-600 font-medium">
                      📞 {b.User?.phone || 'No phone set'}
                    </div>
                  </td>
                  
                  <td className="p-4 font-medium">{b.Futsal?.name}</td>
                  <td className="p-4">{b.date} <br/> <span className="text-xs text-gray-500">{b.timeSlot}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    {b.status === 'Pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(b.id, 'Confirmed')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Approve</button>
                        <button onClick={() => handleStatusUpdate(b.id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;