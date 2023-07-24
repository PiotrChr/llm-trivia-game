import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

function GameListPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const result = await axios('https://example.com/api/games'); // replace with your actual API URL
      setGames(result.data);
    }

    fetchGames();
  }, []);

  return (
    <div className="game-list-page">
      <h1>Game List</h1>
      <ListGroup>
        {games.map((game, index) => (
          <ListGroup.Item key={index}>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Hosted by: {game.host}</Card.Subtitle>
                <Card.Text>
                  Start time: {game.time_start}<br/>
                  Category: {game.current_category}<br/>
                  Max questions: {game.max_questions}
                </Card.Text>
                <Button variant="primary" onClick={() => { /* Implement join game logic here */ }}>Join</Button>
                <Button variant="secondary" onClick={() => { /* Implement view stats logic here */ }}>View Stats</Button>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default GameListPage;