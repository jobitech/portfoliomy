import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Token verification error:', err);
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    };

    verifyToken();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component />;
};

export default ProtectedRoute;
