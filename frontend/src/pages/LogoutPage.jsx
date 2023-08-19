import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { logout } from '../services/api';
import { useAuth } from '../routing/AuthProvider';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    logout();
    setUser(null);

    navigate('/');
  }, []);

  return null;
};

export default LogoutPage;
