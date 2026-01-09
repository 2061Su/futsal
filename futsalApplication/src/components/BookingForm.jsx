import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import NavBar from './NavBar';

const BookingForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [futsal, setFutsal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  

  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    phone: '' 
  });

  const timeSlots = [
    "06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM",
    "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM"
  ];

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const futsalRes = await axios.get(`http://localhost:5000/api/futsals/${id}`);
        setFutsal(futsalRes.data);


        if (userId) {
          const userRes = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
          setBookingData(prev => ({ ...prev, phone: userRes.data.phone || '' }));
        }
      } catch (error) {
        toast.error("Could not load venue details");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      toast.error("Please login to book");
      return navigate('/login');
    }

    try {

      await axios.post('http://localhost:5000/api/bookings', {
        futsalId: id,
        userId: userId,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        phone: bookingData.phone 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update phone in profile if it was changed
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, {
        phone: bookingData.phone
      });

      toast.success("Request sent! Check 'My Bookings' for status.");
      setTimeout(() => navigate('/my-bookings'), 1500);

    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <div className="animate-ping h-8 w-8 bg-emerald-500 rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavBar />
      <Toaster />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT SIDE: SUMMARY */}
          <div className="md:w-5/12 bg-slate-900 p-10 text-white flex flex-col justify-between">
            <div>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">
                Reservation
              </span>
              <h2 className="text-4xl font-black mt-6 tracking-tight leading-tight">
                Secure your <br/><span className="text-emerald-500">Kick-off.</span>
              </h2>
              <p className="text-slate-400 mt-4 font-medium">You are booking a slot at {futsal.name}. After confirming, the owner will review your request.</p>
            </div>

            <div className="mt-12 space-y-4">
               <div className="flex justify-between items-center py-3 border-b border-slate-800">
                 <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Venue</span>
                 <span className="font-bold text-emerald-500">{futsal.name}</span>
               </div>
               <div className="flex justify-between items-center py-3">
                 <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Rate</span>
                 <span className="font-bold">Rs. {futsal.pricePerHour} <span className="text-xs text-slate-500">/hr</span></span>
               </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div className="md:w-7/12 p-10 lg:p-14">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Contact Phone</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400">📞</span>
                  <input 
                    type="text" 
                    required
                    placeholder="98XXXXXXXX"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700 placeholder:font-normal"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Play Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700"
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Time Slot</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 appearance-none"
                    onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                  >
                    <option value="">Choose Slot</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all shadow-xl active:scale-95 ${
                    isSubmitting ? 'bg-slate-300 shadow-none' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200'
                  }`}
                >
                  {isSubmitting ? "Submitting Request..." : "Confirm Booking"}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => navigate('/player-dashboard')} 
                  className="w-full text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest mt-6"
                >
                  Nevermind, go back
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingForm;