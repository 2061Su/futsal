import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If they aren't an admin, send them back to the player dashboard
    return <Navigate to="/player-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;