import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children, role }) => {
  var [user, setUser] = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(() => {
    var token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:7000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setUser(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (role === 'Admin' && user.Role !== 'Admin') return <Navigate to="/" />;
  if (role === 'User' && user.Role === 'Admin') return <Navigate to="/admin" />;

  return children;
}

export default AuthGuard;