import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getGameStats } from '../services/api';
import { Jumbo } from '../components/Layout/Jumbo';

function StatsPage() {
  const [stats, setStats] = useState({});
  const { gameId } = useParams();

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
        url={'/static/img/jumbotron/game-stats/1.png'}
        scrollToContent={true}
      />
      <section className="min-vh-80 mb-8">
        <Container className="mt-6">
          <Row>
            <Col size="12">
              <div className="stats-page">
                <h1>Stats Page</h1>
                <p>
                  This is the stats page. Game functionality will be added here
                  later.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default StatsPage;
