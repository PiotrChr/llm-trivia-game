import React, { useContext, useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { checkAuth } from '../services/api';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuthenticated() {
    try {
      const response = await checkAuth();
      setUser(response.data.name);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const value = {
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function PrivateRoute({ children }) {
  let { user } = useAuth();

  return (
    user ? children : <Navigate to="/login" />
  );
}
