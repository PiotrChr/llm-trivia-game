import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function GameWelcomePage() {
  const history = useHistory();

  const handleHostGame = () => {
    // logic to host a game goes here
    // for now it just redirects to /game
    history.push('/game');
  };

  const handleJoinGame = () => {
    // logic to join a game goes here
    // for now it does nothing
  };

  return (
    <div className="game-welcome-page">
      <h1>Welcome to the Trivia Game</h1>
      <p>Select an option below to start playing.</p>
      <div className="game-actions">
        <Button variant="primary" size="lg" onClick={handleHostGame}>Host a Game</Button>
        <Button variant="secondary" size="lg" onClick={handleJoinGame}>Join a Game</Button>
      </div>
    </div>
  );
}

export default GameWelcomePage;