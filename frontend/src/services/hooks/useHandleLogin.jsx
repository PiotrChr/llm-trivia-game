import React from 'react';
import { useAuth } from '../../routing/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { decode } from '../../utils';
import Cookies from 'js-cookie';

export const useHandleLogin = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (access_token, refresh_token) => {
    Cookies.set('token', access_token);
    Cookies.set('refresh_token', refresh_token);

    const token = decode(access_token);

    setUser({
      id: token.sub.id,
      name: token.sub.name
    });

    navigate('/');
  };

  return { handleLogin };
};
