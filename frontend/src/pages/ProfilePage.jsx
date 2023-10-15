import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getProfileStats } from '../services/api';
import { Jumbo } from '../components/Layout/Jumbo';
import { useTranslation } from 'react-i18next';

function ProfilePage() {
  const [stats, setStats] = useState({});
  const { t } = useTranslation();

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
    <div>
      <Jumbo url="/static/img/jumbotron/profile/1.png" scrollToContent={true} />
      <section className="min-vh-80 mb-8">
        <Container className="mt-6">
          <Row>
            <Col size="12">
              <div className="stats-page">
                <h1>{t('profile.title')}</h1>
                <p>
                  This is the profile page. Game functionality will be added
                  here later.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default ProfilePage;
