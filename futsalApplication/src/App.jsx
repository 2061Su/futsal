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
import OwnerDashboard from './components/OwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Profile from './components/Profile';
import UserResetP from './components/UserResetP';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Router>
      
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserRegistration />} />
        <Route path="/forgot-password" element={<UserForgetP />} />
        <Route path="/reset-password/:token" element={<UserResetP />} />

        {/* You will add your Dashboard routes here later */}
        <Route 
          path="/player-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Player', 'FutsalAdmin', 'Admin']}>
              <PlayerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/book/:id" element={<BookingForm />} />
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute allowedRoles={['Player']}>
              <MyBookings />
            </ProtectedRoute>
          } 
        />
        <Route path="/profile" element={<Profile />} />


        {/* Admin Route */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />


        {/* Futsal Owner Route */}
          <Route 
            path="/owner-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['FutsalAdmin']}>
                <OwnerDashboard /> 
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
