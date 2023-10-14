import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useApiNotifications } from '../services/hooks/useApiNotifications';
import { Col, Row } from 'react-bootstrap';
import { clearNotifications } from '../services/api';
import { useAlert } from '../components/shared/Alert/AlertContext';
import { Jumbo } from '../components/Layout/Jumbo';

function NotificationPage() {
  const { notifications, loading, refresh, error } = useApiNotifications();

  const clearNotification = async (notificationId) => {
    // setNotifications((prev) =>
    //   prev.filter((notif) => notif.id !== notificationId)
    // );
  };

  const clearAllNotifications = async () => {
    try {
      const response = clearNotifications();
    } catch (error) {
      showAlert(
        'Error',
        'There was an error clearing your notifications. Please try again.',
        error.message,
        { variant: 'danger', position: 'bottom' }
      );
    }
  };

  const NotificationColor = ({ type }) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-warning';
      case 'Friend Request':
        return 'bg-gradient-success';
      case 'primary':
        return 'bg-gradient-primary';
      default:
        return 'bg-gradient-secondary';
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  console.log(notifications);

  return (
    <div>
      <Jumbo
        url="/static/img/jumbotron/notifications/3.png"
        scrollToContent={true}
      />
      <section className="min-vh-80 mb-8">
        <div className="container">
          <Card className="card-body blur shadow-blur mx-4 mt-n4 overflow-hidden">
            <h4 className="text-xs mb-0">Notifications</h4>
            <Button
              variant="outline-danger"
              onClick={clearAllNotifications}
              className="btn-round btn-sm mb-0 mt-2 mt-lg-0"
            >
              Clear All
            </Button>
          </Card>
        </div>
        <div className="container mt-6">
          <Row>
            <Col size="12">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr className="d-none d-md-table-row">
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      Notification ID
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      Message
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      Type
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => {
                    return (
                      <tr key={notification.id}>
                        <td className="d-none d-md-table-cell">
                          <h6 className="mb-0 text-xs">{notification.id}</h6>
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          <h6 className="mb-0 text-xs">
                            {notification.message}
                          </h6>
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          <span
                            className={`badge badge-sm ${NotificationColor(
                              notification.name
                            )}`}
                          >
                            {notification.name}
                          </span>
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          <Button
                            variant="outline-secondary"
                            onClick={() => clearNotification(notification.id)}
                            className="btn-round btn-sm mb-0 mt-2 mt-lg-0"
                          >
                            Clear
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

export default NotificationPage;
