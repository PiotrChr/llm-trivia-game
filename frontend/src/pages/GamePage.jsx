import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../routing/AuthProvider';
import { getGame, isPlaying, startGame } from '../services/api';
import { socket } from '../services/socket';

// This is a placeholder component for the sidebar
const Sidebar = ({ players }) => (
  <div className="sidebar">
    <h2>Players</h2>
    {players.map(player => (
      <p key={player.id}>{player.name} 
        {
          player.ready && (<span><i className='bi-check' /></span>)
        }
      </p>
    ))}
  </div>
);

const Countdown = ({ secondsLeft, title, showProgressBar }) => {
  
  return (
    <div>
      <h2>{ title }</h2>
      { secondsLeft > 0 && <p>Question will start in {secondsLeft} seconds</p> }
      { showProgressBar && <ProgressBar now={secondsLeft} max={10} /> }
    </div>
    
  );
};
Countdown.defaultProps = {
  title: 'Loading...'
};

// { id: 1, name: 'Player 1', ready: false, points: 0 },

const GamePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [question, setQuestion] = useState();
  const [players, setPlayers] = useState([]);
  const [allReady, setAllReady] = useState(false);
  const [allAnswered, setAllAnswered] = useState(false);
  const [questionReady, setQuestionReady] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [game, setGame] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [answers, setAnswers] = useState([]);

  const gameId = useParams().gameId;

  const categoryOptions = [{ label: "Sports", value: "sports" }, { label: "History", value: "history" }];
  const difficultyOptions = Array.from({length: 5}, (_, i) => ({ label: `Level ${i+1}`, value: i+1 }));
  
  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
  };

  const addPlayer = (player) => {
    setPlayers(players => {
      if (players.some(existingPlayer => existingPlayer.id === player.id)) {
        return players;
      } else {
        return [
          ...players, 
          {
            id: player.id,
            name: player.name,
            ready: false,
            points: 0
          }
        ];
      }
    });
  };

  const isReady = (player) => {
    return players.some(existingPlayer => existingPlayer.id === player.id && existingPlayer.ready);
  };

  const removePlayer = (player) => {
    console.log('remove', player)
    console.log(players)
    setPlayers(players.filter(p => p.id !== player.id));
  };

  const handleDifficultyChange = (selectedOption) => {
    setDifficulty(selectedOption);
  };

  const handleReady = () => {
    console.log('ready');
    socket.emit('ready', { player: user, game_id: gameId });
  };

  const handleStartGame = () => {
    console.log('start');

    socket.emit('start', { game_id: gameId, player: user });
  };

  useEffect(() => {
    const fetchGame = async () => {
      const playing = await isPlaying(gameId);
      if (!playing) {
        navigate('/error/unable-to-join-game');
        return;
      }

      const game = await getGame(gameId);
      if (!game) {
        alert('Failed to fetch game');
        return;
      }

      setGame(game.data);
      setCategory(game.data.current_category);
      setIsHost(game.data.host === user.id);
    };

    fetchGame();

    socket.emit('ping', {game_id: gameId});
    socket.emit('join', { player: user, game_id: gameId });

    return () => {
      socket.emit('leave', { player: user, game_id: gameId });
    }
  }, []);

  useEffect(() => {
    const onStarted = () => {
      setGameStarted(true);
      socket.emit('next', {game_id: gameId, player: user, category, difficulty});
    };
    const onStop = () => {
      setGameStarted(false);
    };
    const onPing = () => {
      console.log('got ping');
      socket.emit('pong', { player: user, game_id: gameId });
    };
    const onCountdown = (data) => {
      console.log('got countdown', data);
      setCountdown(data.remaining_time);
    };
    const onDrawing = (data) => {
      console.log('got drawing', data);
      setDrawing(true);
    };
    const onDrawn = (data) => {
      console.log('got drawn', data);
      setDrawing(false);
    };
    const onQuestionReady = (data) => {
      setQuestionReady(true);
      setQuestion(data.question);
      setAnswers(data.answers);
    };

    socket.on('question_ready', onQuestionReady)
    socket.on('drawn', onDrawn)
    socket.on('drawing', onDrawing)
    socket.on('countdown', onCountdown);
    socket.on('ping', onPing);
    socket.on('started', onStarted);
    socket.on('stop', onStop);
    
    return () => {  
      socket.off('question_ready', onQuestionReady)
      socket.off('drawn', onDrawn)
      socket.off('drawing', onDrawing)
      socket.off('countdown', onCountdown);
      socket.off('ping', onPing);
      socket.off('started', onStarted);
      socket.off('stop', onStop);
    };
  }, []);

  useEffect(() => { 
    const onIsReady = (data) => {
      console.log('got is_ready', data);

      setPlayers(players => players.map(player => {
        if (player.id === data.player.id) {
          return {
            ...player,
            ready: true
          };
        }
  
        return player;
      }));
    };
    const onJoined = (data) => {
      console.log('got joined', data);
      addPlayer(data.player);
    };
    const onLeft = (data) => {
      console.log('got left', data);
      removePlayer(data.player);
    };
    const onPong = (data) => {
      console.log('got pong', data);
      addPlayer(data.player);
    };


    socket.on('joined', onJoined);
    socket.on('left', onLeft);
    socket.on('is_ready', onIsReady);
    socket.on('pong', onPong);
    socket.on('is_ready', onIsReady);

    return () => {
      socket.off('joined', onJoined);
      socket.off('left', onLeft);
      socket.off('is_ready', onIsReady);
      socket.off('pong', onPong);
      socket.off('is_ready', onIsReady);
    }
  }, [players]);


  useEffect(() => {
    setAllReady(players.every(player => player.ready));
  }, [players]);

  return (
    <Container>
      <Row>
        <Col xs={8}>
          <h1>Category: {category}</h1>
          { questionReady && (
            <>
              <Card>
                <Card.Body>{game.question.text}</Card.Body>
              </Card>
              { answers.map((answer, index) => (
                <Button key={index}>{answer}</Button>
              ))}
            </>
          )}
          { 
            !questionReady && (countdown > 0 || drawing) &&
              <Countdown
                secondsLeft={countdown}
                title={ drawing ? 'Drawing a question' : 'Countdown' }
                showProgressBar={!drawing}
              /> 
          }
          { !questionReady && !isReady(user) && (
            <Button onClick={handleReady}>Ready</Button>
          )}
          {/* { !questionReady && !isHost && !serverStarted && (
            <Button onClick={handleStartServer}>Start Server</Button>
          )} */}
          { !questionReady && isHost && !gameStarted && allReady && countdown == 0 && (
            <Button onClick={handleStartGame}>Start Game</Button>
          )}
          { gameStarted && isHost && (
            <Button>Stop Game</Button>
          )}
          { gameStarted && allAnswered && (
            <Button>Next question</Button>
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