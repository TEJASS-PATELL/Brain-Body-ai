import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../api';
import { OrbitProgress } from 'react-loading-indicators';

const ProtectedRoute: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await api.get('/api/auth/check');
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (isLoading) 
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <OrbitProgress variant="dotted" color="black" size="large" />
  </div>
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
