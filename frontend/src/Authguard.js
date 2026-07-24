import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children, requiredRole }) => {
  const stored = localStorage.getItem("auth");

  if (!stored) {
    return <Navigate to="/login" replace />;
  }

  const { user } = JSON.parse(stored);

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />; 
  }

  return children;
};

export default AuthGuard;