import { useState, useEffect } from 'react';
import { getNotifications } from '../api';

export const useApiNotifications = (playerId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setLoading(true);

    try {
      const response = await getNotifications();
      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!playerId) return;

    const fetchNotifications = async () => {
      setLoading(true);

      try {
        const response = await getNotifications();
        setNotifications(response.data.notifications || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [playerId]);

  return { notifications, loading, refresh, error };
};
