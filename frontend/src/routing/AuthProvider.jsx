import React, { useContext, useState, useEffect, useMemo } from 'react';
import jwt_decode from 'jwt-decode';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { checkAuth } from '../services/api';
import { checkJWT, getJWT } from '../utils';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  async function checkAuthenticated() {
    const token = checkJWT();

    if (token) {
      setToken(getJWT());

      const newUser = {
        id: token.sub.id,
        name: token.sub.name
      };

      if (JSON.stringify(user) !== JSON.stringify(newUser)) {
        setUser(newUser);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const userValue = useMemo(() => user, [user]);
  const contextValue = useMemo(
    () => ({
      user: userValue,
      setUser,
      token
    }),
    [userValue, token]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function PrivateRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" />;
}
