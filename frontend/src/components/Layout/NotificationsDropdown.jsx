import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSocketNotifications } from '../../services/hooks/useSocketNotifications';
import { useApiNotifications } from '../../services/hooks/useApiNotifications';
import { markAllNotificationsAsRead } from '../../services/api';
import { useAlert } from '../shared/Alert/AlertContext';
import { useTranslation } from 'react-i18next';

const NotificationDropdown = ({ user }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { t } = useTranslation();

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
    (notification) => notification.read === 0
  );

  const markAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();

      if (response.status === 200) {
        showAlert('Success', 'All notifications marked as read.', null, {
          variant: 'success',
          position: 'bottom'
        });
        refresh();
      }
    } catch (error) {
      showAlert(
        'Error',
        'There was an error marking your notifications as read. Please try again.',
        error.message,
        { variant: 'danger', position: 'bottom' }
      );
    }
  };

  return (
    <Dropdown id="notifications-dropdown">
      <Dropdown.Toggle
        variant={
          allNotifications && allNotifications.length > 0
            ? 'primary'
            : 'outline-primary'
        }
        id="notifications-dropdown-btn"
        className="btn-sm btn-round btn-icon-only mb-0 me-2 mt-0 mt-lg-1"
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
        <div className="d-flex justify-content-center mt-2">
          {hasUnreadNotifications ||
            (true && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="mb-1 w-100 ms-2 me-2 px-1 py-1"
                onClick={markAllAsRead}
              >
                <small>{t('notifications.mark_all_as_read')}</small>
              </Button>
            ))}
          <Button
            variant="outline-secondary"
            className="btn-icon-only mb-1 me-2"
            onClick={() => navigate('/notifications')}
          >
            <i className="bi-box-arrow-up-right"></i>
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
