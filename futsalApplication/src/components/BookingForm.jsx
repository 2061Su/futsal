import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BookingForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [futsal, setFutsal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: ''
  });


  const timeSlots = [
    "06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM",
    "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM"
  ];

  useEffect(() => {
    const fetchFutsalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/futsals/${id}`);
        setFutsal(response.data);
      } catch (error) {
        toast.error("Could not load futsal details");
      }
    };
    fetchFutsalDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button to prevent double clicks
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // <--- Retrieve the dynamic ID
    console.log("Current User ID is:", userId);
    
    if (!token || !userId) {
      toast.error("Please login to book");
      return navigate('/login');
    }

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        futsalId: id,
        userId: userId, // <--- IS THIS LINE HERE?
        date: bookingData.date,
        timeSlot: bookingData.timeSlot
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Booking Request Sent!");

      // Wait 1.5 seconds so they see the toast before the page changes
      setTimeout(() => {
        navigate('/my-bookings'); 
      }, 1500);

    } catch (error) {
      setIsSubmitting(false); // Re-enable button so user can try again
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!futsal) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Book {futsal.name}</h2>
        <p className="text-gray-600 mb-6">📍 {futsal.location} | Rs. {futsal.pricePerHour}/hr</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Select Date</label>
            <input 
              type="date" 
              required
              className="w-full p-2 border rounded"
              onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
              min={new Date().toISOString().split('T')[0]} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Select Time Slot</label>
            <select 
              required
              className="w-full p-2 border rounded"
              onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
            >
              <option value="">-- Choose a slot --</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/player-dashboard')}
            className="w-full text-gray-500 text-sm py-1"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;