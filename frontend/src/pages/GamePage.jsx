import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../routing/AuthProvider';
import { getGame } from '../services/api';
import { socket } from '../services/socket';

// This is a placeholder component for the sidebar
const Sidebar = ({ players }) => (
  <div className="sidebar">
    <h2>Players</h2>
    {players.map(player => (
      <p key={player.id}>{player.name}</p>
    ))}
  </div>
);

const GamePage = () => {
  const { user } = useAuth();

  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [question, setQuestion] = useState();
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', ready: false, points: 0 },
  ]);
  const [allReady, setAllReady] = useState(false);
  const [questionReady, setQuestionReady] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [game, setGame] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [serverStarted, setServerStarted] = useState(false);

  const gameId = useParams().gameId;

  const categoryOptions = [{ label: "Sports", value: "sports" }, { label: "History", value: "history" }];
  const difficultyOptions = Array.from({length: 5}, (_, i) => ({ label: `Level ${i+1}`, value: i+1 }));

  // This is a placeholder for the possible answers
  const answers = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'];

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
  };

  const addPlayer = (player) => {
    setPlayers([...players, player]);
  };

  const removePlayer = (player) => {
    setPlayers(players.filter(p => p.id !== player.id));
  };

  const handleDifficultyChange = (selectedOption) => {
    setDifficulty(selectedOption);
  };

  const handleReady = () => {
  };

  const handleStartServer = () => {
  };

  const handleStartGame = () => {
  };

  useEffect(() => {
    const fetchGame = async () => {
      const game = await getGame(gameId);
      if (!game) {
        alert('Failed to fetch game');
        return;
      }

      setGame(game.data);
      setCategory(game.data.category);
      setIsHost(game.data.host === user);
    };

    fetchGame();

    socket.on('joined', (data) => {
      addPlayer(data.player_id);
    });

    socket.on('left', (data) => {
      removePlayer(data.player_id);
    });

    socket.on('started', () => {
      setGameStarted(true);
    });

    socket.on('stop', () => {
      setGameStarted(false);
    });

    socket.on('is_ready', (data) => {
      setPlayers(players.map(player => {
        if (player.id === data.player_id) {
          player.ready = true;
        }

        return player;
      }
      ));

      setAllReady(players.every(player => player.ready));
    });

    socket.emit('join', { player_id: user, game_id: gameId });
  }, [gameId]);

  return (
    <Container>
      <Row>
        <Col xs={8}>
          <h1>Category: {category}</h1>
          {questionReady && (
            <>
              <Card>
                <Card.Body>{game.question.text}</Card.Body>
              </Card>
              {answers.map((answer, index) => (
                <Button key={index}>{answer}</Button>
              ))}
            </>
          )}
          {!questionReady && (
            <Button onClick={handleReady}>Ready</Button>
          )}
          {!questionReady && !isHost && !serverStarted && (
            <Button onClick={handleStartServer}>Start Server</Button>
          )}
          {!questionReady && isHost && !gameStarted && allReady && (
            <Button onClick={handleStartGame}>Start Game</Button>
          )}
        </Col>
        <Col xs={4}>
          <Sidebar players={players} />
          <Select
            options={categoryOptions}
            value={category}
            onChange={handleCategoryChange}
            isSearchable
            placeholder="Select a category..."
          />
          <Select
            options={difficultyOptions}
            value={difficulty}
            onChange={handleDifficultyChange}
            isSearchable
            placeholder="Select a difficulty..."
          />
          {isTimed && <ProgressBar now={timeElapsed} max={timeLimit} />}
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;