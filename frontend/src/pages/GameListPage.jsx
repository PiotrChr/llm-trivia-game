import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import { getGames } from '../services/api';
import { useAuth } from '../routing/AuthProvider';  // import AuthContext to access current user information
import { Col, Row } from 'react-bootstrap';

function GameListPage() {
  const [games, setGames] = useState([]);
  
  const navigate = useNavigate();
  const { user } = useAuth(); // get current user from AuthContext

  useEffect(() => {
    const fetchGames = async () => {
      const result = await getGames();
      setGames(result.data);
    }

    fetchGames();
  }, []);

  const handleJoin = async (gameId) => {
    navigate('/game/join/' + gameId);
  };

  const handleConnect = (gameId) => {
    navigate('/game/' + gameId);
  };

  // Check if the current user has joined a specific game
  const hasJoined = (game) => {
    return game.players.some(player => player.player_id === user.id);
  }

  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header min-height-300 align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={{borderRadius: '0px 0px 24px 24px' }}
      >
        <span className="mask bg-gradient-primary opacity-6"></span>
      </div>
      <Card className='card-body blur shadow-blur mx-4 mt-n4 overflow-hidden'>
        <Row className='gx-4'>
          Test  
        </Row>
      </Card>
      <div className="container mt-6">
        <Row>
          <Col size="12">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">Game ID</th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">Category</th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">Players</th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">Status</th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"></th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"></th>
                </tr>
              </thead>
              <tbody>
                { games.map((game) => {
                  return (
                    <tr key={game.id}>
                      <td>
                        <h6 className="mb-0 text-xs"> { game.id } </h6>
                      </td>
                      <td className='align-middle text-center text-sm'>
                        <h6 className="mb-0 text-xs"> CATID </h6>
                      </td>
                      <td className='align-middle text-center text-sm'>
                        <h6 className="mb-0 text-xs"> { game.players.length } </h6>
                      </td>
                      <td className='align-middle text-center text-sm'>
                        <span className="badge badge-sm bg-gradient-success">somestatus</span>
                      </td>
                      <td className="align-middle text-center text-sm">
                        <Button variant="outline-secondary" className="btn-round mb-0" onClick={() => { /* Implement view stats logic here */ }}>View Stats</Button>
                      </td>
                      <td className='align-middle text-center text-sm'>
                        {
                          hasJoined(game) 
                            ? <Button variant="outline-primary" onClick={() => handleConnect(game.id)} className="btn-round btn-sm mb-0">Connect</Button>
                            : <Button variant="outline-success" onClick={() => handleJoin(game.id)} className="btn-round btn-sm mb-0">Join</Button>
                        }
                      </td>
                    </tr>
                  )
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