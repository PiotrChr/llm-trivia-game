import { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../routing/AuthProvider';

/* eslint-disable no-undef */
const API_HOST = process.env.BACKEND_HOST || 'localhost';
const API_PORT =
  process.env.BACKEND_PORT_PUBLIC !== ''
    ? `:${process.env.BACKEND_PORT_PUBLIC}`
    : '';

const BASE_URL = `${API_HOST}${API_PORT}`;
/* eslint-enable no-undef */

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(BASE_URL, {
        query: `token=${token}`
      });

      console.log('connected to socket');

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [user]);

  return socket;
}
