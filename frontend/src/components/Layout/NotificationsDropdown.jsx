import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useSocketNotifications } from '../../services/hooks/useSocketNotifications';
import { useApiNotifications } from '../../services/hooks/useApiNotifications';

import { markAllNotificationsAsRead } from '../../services/api';

const NotificationDropdown = ({ user }) => {
  const {
    notifications: apiNotifications,
    loading,
    refresh,
    error
  } = useApiNotifications(user.id);

  const socketNotifications = useSocketNotifications();
  const allNotifications = [...apiNotifications, ...socketNotifications].filter(
    (notification) => notification.read === 0
  );

  const hasUnreadNotifications = allNotifications.some(
    (notification) => !notification.read
  );

  const markAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();

      if (response.status === 200) {
        console.log('All notifications marked as read');
        refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log('apiNotifications', apiNotifications);
  console.log('socketNotifications', socketNotifications);

  return (
    <Dropdown id="notifications-dropdown">
      <Dropdown.Toggle
        variant={
          allNotifications && allNotifications.length > 0
            ? 'primary'
            : 'outline-primary'
        }
        id="notifications-dropdown-btn"
        className="btn-sm btn-round btn-icon-only mb-0 mt-1 me-2"
      >
        <i className="bi-bell-fill"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        {allNotifications && allNotifications.length > 0 ? (
          allNotifications.map((notification) => (
            <Dropdown.Item
              key={notification.id}
              style={{
                backgroundColor: notification.read ? 'transparent' : '#f5f5f5'
              }}
              className="d-flex flex-row justify-content-center align-items-center"
            >
              <div className="">
                {/* Shows icon for each type of notification */}
                {notification.name === 'Friend Request' && (
                  <i className="bi-person-plus-fill me-2"></i>
                )}
                {notification.name === 'Player Invited' && (
                  <i className="bi-person-fill-add me-2"></i>
                )}
              </div>
              <div style={{ minWidth: '150px' }}>{notification.name}</div>
              <div style={{ fontSize: '0.8em', color: 'gray' }}>
                {new Date(notification.created_at).toLocaleDateString()}
              </div>
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item>No new notifications</Dropdown.Item>
        )}
        {hasUnreadNotifications && (
          <div className="d-flex justify-content-center mt-2">
            <Button
              variant="outline-secondary"
              size="sm"
              className="mb-1 w-100 ms-2 me-2"
              onClick={markAllAsRead}
            >
              <small>Mark all as read</small>
            </Button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
