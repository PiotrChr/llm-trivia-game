import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getGameStats } from '../services/api';
import { Jumbo } from '../components/Layout/Jumbo';

import { useTranslation } from 'react-i18next';

function StatsPage() {
  const [stats, setStats] = useState({});
  const { gameId } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      const response = await getGameStats(gameId);
      console.log(response);

      if (response.status === 200) {
        setStats(response.data);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Jumbo
        url={'/static/img/jumbotron/game-stats/3.png'}
        scrollToContent={true}
      />
      <section className="min-vh-80 mb-8">
        <Container className="mt-6">
          <Row>
            <Col size="12">
              <div className="stats-page">
                <h1>{t('game_stats.title')}</h1>
                <p>{t('game_stats.description')}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default StatsPage;
