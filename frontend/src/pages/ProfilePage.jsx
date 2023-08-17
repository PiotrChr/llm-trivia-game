import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getProfileStats } from '../services/api';

function ProfilePage() {
  const [stats, setStats] = useState({});
  const { gameId } = useParams();

  useEffect(() => {
    const fetchStats = async () => {
      const response = await getProfileStats();
      console.log(response);

      if (response.status === 200) {
        setStats(response.data);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header min-height-300 align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={{
          backgroundImage: '/static/assets/img/curved-images/curved14.jpg',
          borderRadius: '0px 0px 24px 24px'
        }}
      >
        <span className="mask bg-gradient-dark opacity-6"></span>
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} className="text-center mx-auto">
              <h1 className="text-white mb-2 mt-5">Profile Page</h1>
              <p className="text-lead text-white">
                This is the profile page. Game functionality will be added here
                later.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="mt-6">
        <Row>
          <Col size="12">
            <div className="stats-page">
              <h1>Profile Page</h1>
              <p>
                This is the profile page. Game functionality will be added here
                later.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ProfilePage;
