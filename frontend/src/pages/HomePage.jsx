import React, { useContext } from 'react';
import { Jumbotron, Button, Container } from 'react-bootstrap';
// Assuming you have UserContext
import { UserContext } from '../UserContext';

const HomePage = () => {
  // Again, replace with your global state management
  const { user } = useContext(UserContext);

  return (
    <div>
      <Jumbotron>
        <h1>Welcome to LLM Trivia Game!</h1>
        <p>
          Test your knowledge across a wide range of topics with the LLM Trivia Game. Can you beat the high score?
        </p>
        <p>
          {!user && (
            <>
              <Button variant="primary" href="/signup" size="lg" className="mr-3">Signup</Button>
              <Button variant="secondary" href="/login" size="lg">Login</Button>
            </>
          )}
          {user && (
            <Button variant="primary" href="/game" size="lg">Play Now!</Button>
          )}
        </p>
      </Jumbotron>
      <Container>
        <h2>About the Game</h2>
        <p>
          The LLM Trivia Game is a fun and challenging quiz game. Players must answer a series of questions on various topics as accurately and quickly as possible. The game features a wide variety of categories, ensuring that players will be tested on a range of knowledge. Get started now and see how much you know!
        </p>
      </Container>
    </div>
  );
};

export default HomePage;