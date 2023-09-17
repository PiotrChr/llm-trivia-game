import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../services/api';
import { Col, Row } from 'react-bootstrap';

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const result = await getNotifications();
      setNotifications(result.data);
    };
    fetchNotifications();
  }, []);

  const clearNotification = async (notificationId) => {
    // Clear individual notification logic here
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    // Clear all notifications logic here
    setNotifications([]);
  };

  const NotificationColor = ({ type }) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-warning';
      case 'success':
        return 'bg-gradient-success';
      case 'primary':
        return 'bg-gradient-primary';
      default:
        return 'bg-gradient-secondary';
    }
  };

  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header min-height-300 align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={{ borderRadius: '0px 0px 24px 24px' }}
      >
        <span className="mask bg-gradient-secondary opacity-6"></span>
      </div>
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
                        <h6 className="mb-0 text-xs">{notification.message}</h6>
                      </td>
                      <td className="align-middle text-center text-sm d-none d-md-table-cell">
                        <span
                          className={`badge badge-sm ${NotificationColor(
                            notification.type
                          )}`}
                        >
                          {notification.type}
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
  );
}

export default NotificationPage;
