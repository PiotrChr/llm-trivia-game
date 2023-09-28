import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';
import { useAlert } from '../../components/shared/Alert/AlertContext';

export const useSocketNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { showAlert } = useAlert();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('newNotification', (data) => {
      console.log(data);

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data.notification
      ]);

      showAlert('New notification', data.notification.name, null, {
        variant: 'info',
        position: 'bottom'
      });
    });

    return () => {
      socket.off('newNotification');
      socket.close();
    };
  }, [socket]);

  return notifications;
};
