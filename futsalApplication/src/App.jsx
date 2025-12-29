import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import UserLogin from './components/UserLogin'
import UserRegistration from './components/UserRegistration'
import UserForgetP from './components/UserForgetP'
import BookingForm from './components/BookingForm';
import PlayerDashboard from './components/PlayerDashboard';
import MyBookings from './components/MyBookings';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Profile from './components/Profile';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserRegistration />} />
        <Route path="/forgot-password" element={<UserForgetP />} />

        {/* You will add your Dashboard routes here later */}
        <Route path="/player-dashboard" element={<PlayerDashboard />} />
        <Route path="/book/:id" element={<BookingForm />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['FutsalAdmin', 'Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<UserLogin />} />
      </Routes>
    </Router>
    </>
    
  )
}

export default App
