import React, { useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { checkAuth } from '../services/api';
import { checkJWT } from '../utils';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuthenticated() {
    const token = checkJWT();

    if (token) {
      setUser({
        id: token.sub.id,
        name: token.sub.name
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const value = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function PrivateRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" />;
}
