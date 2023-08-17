import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/api';
import { useAuth } from '../routing/AuthProvider';
import { Col, Row } from 'react-bootstrap';

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
    <section className="min-vh-80 mb-8">
      <div
        className="page-header min-height-300 align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={{ borderRadius: '0px 0px 24px 24px' }}
      >
        <span className="mask bg-gradient-secondary opacity-6"></span>
      </div>
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
                        <h6 className="mb-0 text-xs"> {leader.total_score} </h6>
                      </td>
                      <td className="align-middle text-center text-sm">
                        <h6 className="mb-0 text-xs">
                          {' '}
                          {leader.most_played_cat}{' '}
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
  );
}

export default GameListPage;
