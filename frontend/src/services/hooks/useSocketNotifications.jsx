import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

export const useSocketNotifications = (playerId, token) => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('newNotification', (data) => {
      console.log('newNotification', data);

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data.notification
      ]);
    });

    return () => {
      socket.off('newNotification');
      socket.close();
    };
  }, [playerId]);

  return notifications;
};
