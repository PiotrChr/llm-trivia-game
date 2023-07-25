import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import { getGames, joinGame } from '../services/api';

function GameListPage() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      const result = await getGames();
      setGames(result.data);
    }

    fetchGames();
  }, []);

  const handleJoin = async (gameId) => {
    const response = await joinGame(gameId);

    if (!response) {
      alert('Failed to join game');
      return;
    }
    
    navigate('/game/' + gameId);
  };

  return (
    <div className="game-list-page">
      <h1>Game List</h1>
      <ul style={{listStyleType: 'none'}}>
        {games.map((game, index) => (
          <li key={index} className='d-flex mb-2'>
            <Card style={{ width: '100%' }}>
              <Card.Body className="d-flex flex-row">
                <div className="flex-grow-1">
                  <Card.Title>{game.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Hosted by: {game.host}</Card.Subtitle>
                  <Card.Text>
                    <strong>Start time: </strong>{game.time_start}<br/>
                    <strong>Category: {game.current_category}</strong><br/>
                    <strong>Max questions: </strong>{game.max_questions}
                    <strong>Players: </strong>TBD
                  </Card.Text>
                </div>
                <div className="d-grid align-items-end">
                  <Button variant="primary" onClick={() => handleJoin(game.id)} className="mr-2">Join</Button>
                  <Button variant="secondary" onClick={() => { /* Implement view stats logic here */ }}>View Stats</Button>
                </div>
              </Card.Body>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameListPage;