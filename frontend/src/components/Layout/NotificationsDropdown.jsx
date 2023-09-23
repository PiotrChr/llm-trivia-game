import React from 'react';
import { Dropdown } from 'react-bootstrap';

const NotificationDropdown = ({ notifications }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="none" id="notification-dropdown">
        <i className="bi-bell-fill"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Dropdown.Item key={notification.id} style={{ backgroundColor: notification.read ? 'transparent' : '#f5f5f5' }}>
              {notification.message}
              <div style={{ fontSize: '0.8em', color: 'gray' }}>
                {new Date(notification.created_at).toLocaleDateString()}
              </div>
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item>No new notifications</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationDropdown;