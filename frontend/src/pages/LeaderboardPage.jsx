import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/api';
import { useAuth } from '../routing/AuthProvider';
import { Col, Row } from 'react-bootstrap';
import { Jumbo } from '../components/Layout/Jumbo';

function GameListPage() {
  const [leaders, setLeaders] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaders = async () => {
      const result = await getLeaderboard();
      console.log(result.data);

      setLeaders(result.data);
    };

    fetchLeaders();
  }, []);

  return (
    <div>
      <Jumbo
        url="static/img/jumbotron/leaderboard/3.jpg"
        scrollToContent={true}
      ></Jumbo>

      <section>
        <div className="container">
          <Card className="card-body blur shadow-blur mx-4 mt-n4 overflow-hidden">
            <h4 className="text-xs mb-0">Game list</h4>
          </Card>
        </div>
        <div className="container mt-6">
          <Row>
            <Col size="12">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      Username
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      Points
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      Most played category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaders.map((leader) => {
                    return (
                      <tr key={leader.id}>
                        <td>
                          <h6 className="mb-0 text-xs"> {leader.name} </h6>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <h6 className="mb-0 text-xs">
                            {' '}
                            {leader.total_score}{' '}
                          </h6>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <h6 className="mb-0 text-xs">
                            {leader.category_name}
                          </h6>
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

export default GameListPage;
