import React, { useEffect, useState } from 'react';
import { Button, Col, Container, ProgressBar, Row, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import classNames from 'classnames';
import Countdown from '../components/Game/Countdown';
import QuestionCard from '../components/Game/QuestionCard';
import Sidebar from '../components/Game/SideBar';
import { useAuth } from '../routing/AuthProvider';
import { getCategories, getGame, getLanguages, isPlaying } from '../services/api';
import { socket } from '../services/socket';
import { getRandomBackground  } from '../utils';
// { id: 1, name: 'Player 1', ready: false, points: 0 },


const GamePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    id: 0,
    name: 'None'
  });
  const [difficulty, setDifficulty] = useState(1);
  const [question, setQuestion] = useState();
  const [categories, setCategories] = useState(
    [
      { label: "Sports", value: "sports" },
      { label: "History", value: "history" },
    ]
  );
  const [players, setPlayers] = useState([]);
  const [allReady, setAllReady] = useState(false);
  const [allAnswered, setAllAnswered] = useState(false);
  const [questionReady, setQuestionReady] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState(null);
  const [isTimed, setIsTimed] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [game, setGame] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [correctAnswerId, setCorrectAnswerId] = useState(null);
  const [currentBackground, setCurrentBackground] = useState(null);

  const gameId = useParams().gameId;

  const difficultyOptions = Array.from({length: 5}, (_, i) => ({ label: `Level ${i+1}`, value: i+1 }));
  
  const handleCategoryChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      setCategories([...categories, newValue]);
    }
    setCategory(newValue);
  };

  const handleLanguageChange = (newValue) => {
    setLanguage(newValue);
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
            points: 0,
            answer: null
          }
        ];
      }
    });
  };

  const isReady = (player) => {
    return players.some(existingPlayer => existingPlayer.id === player.id && existingPlayer.ready);
  };

  const setPlayerAnswer = (player, answer_id) => {
    setPlayers(players.map(existingPlayer => {
      if (existingPlayer.id === player.id) {
        return {
          ...existingPlayer,
          answer: answer_id
        };
      }
      return existingPlayer;
    }));
  };

  const removePlayer = (player) => {
    setPlayers(players.filter(p => p.id !== player.id));
  };

  const handleDifficultyChange = (selectedOption) => {
    setDifficulty(selectedOption);
  };

  const handleReady = () => {
    socket.emit('ready', { player: user, game_id: gameId });
  };

  const handleStartGame = () => {
    socket.emit('start', { game_id: gameId, player: user });
  };

  const handleAnswerClicked = (answerId) => {
    setSelectedAnswerId(answerId);
    socket.emit('answer', { game_id: gameId, player: user, answer_id: answerId });
  };

  const handleNextQuestionClick = () => {
    console.log('next question');
    resetAll();
    socket.emit('next', {game_id: gameId, player: user, category: category.id, difficulty});
  };

  const resetAll = () => {
    setQuestionReady(false);
    setSelectedAnswerId(null);
    setCorrectAnswerId(null);
    setAnswers([]);
    setPlayers(players.map(player => ({ ...player, answer: null })));
  };

  useEffect(() => {
    setCurrentBackground(getRandomBackground(category['id']));
  }, [category['id']]);

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

    const fetchLanguages = async () => {
      const result = await getLanguages();
      setLanguages(result.data.map(language => ({ label: language.name, value: language.id })));
    };

    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result.data.map(category => ({ label: category.name, value: category.id })));
    };

    fetchGame();
    fetchLanguages();
    fetchCategories();

    socket.emit('ping', {game_id: gameId});
    socket.emit('join', { player: user, game_id: gameId });

    return () => {
      socket.emit('leave', { player: user, game_id: gameId });
    }
  }, []);

  useEffect(() => {
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
      console.log('got question_ready', data);
      setQuestion(data.next_question);
      setAnswers(data.next_question.answers);
      setQuestionReady(true);
    };

    socket.on('question_ready', onQuestionReady)
    socket.on('drawn', onDrawn)
    socket.on('drawing', onDrawing)
    socket.on('countdown', onCountdown);
    socket.on('ping', onPing);
    socket.on('stop', onStop);
    
    return () => {  
      socket.off('question_ready', onQuestionReady)
      socket.off('drawn', onDrawn)
      socket.off('drawing', onDrawing)
      socket.off('countdown', onCountdown);
      socket.off('ping', onPing);
      socket.off('stop', onStop);
    };
  }, []);

  useEffect(() => {
    const onStarted = () => {
      setGameStarted(true);
      socket.emit('next', {game_id: gameId, player: user, category: category.id, difficulty});
    };

    socket.on('started', onStarted);

    return () => {
      socket.off('started', onStarted);
    }
  }, [difficulty, category]);

  useEffect(() => { 
    const onIsReady = (data) => {
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
      addPlayer(data.player);
    };
    const onLeft = (data) => {
      removePlayer(data.player);
    };
    const onPong = (data) => {
      addPlayer(data.player);
    };
    const onAnswered = (data) => {
      setPlayerAnswer(data.player, data.answer_id);
    };
    
    socket.on('answered', onAnswered);
    socket.on('joined', onJoined);
    socket.on('left', onLeft);
    socket.on('is_ready', onIsReady);
    socket.on('pong', onPong);
    socket.on('is_ready', onIsReady);

    return () => {
      socket.off('answered', onAnswered);
      socket.off('joined', onJoined);
      socket.off('left', onLeft);
      socket.off('is_ready', onIsReady);
      socket.off('pong', onPong);
      socket.off('is_ready', onIsReady);
    }
  }, [players]);

  useEffect(() => {
    setAllReady(players.every(player => player.ready));
    setAllAnswered(players.every(player => player.answer !== null));
  }, [players]);

  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={{
          backgroundImage: `url(${currentBackground})`,
          borderRadius: '0px 0px 24px 24px',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <span className="mask bg-gradient-dark opacity-6"></span>
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} className="text-center mx-auto">
              <h1 className="text-white mb-2 mt-10">{ category.name }</h1>
              <p className="text-lead text-white">Current difficulty: { difficulty }</p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="mt-lg-n10 mt-md-n11 mt-n10">
          <Card>
            <Card.Body className='row'>
              <Col xs={8}>
              { questionReady && 
                <QuestionCard
                  question={question}
                  answers={answers}
                  handleAnswerClicked={handleAnswerClicked}
                  selectedAnswerId={selectedAnswerId}
                  player_answers={
                    allAnswered ? players.map(player => {
                      if (player.answer) {
                        return {
                          player: player.name,
                          answer: player.answer
                        }
                      }
                    
                    }) : []
                  }
                />
              }
              { 
                !questionReady && (countdown > 0 || drawing) &&
                  <Countdown
                    secondsLeft={countdown}
                    title={ drawing ? 'Drawing a question' : 'Countdown' }
                    showProgressBar={!drawing}
                  /> 
              }
            </Col>
            <Col xs={4}>
              <Sidebar players={players} />
              <Select
                options={categories}
                value={category.name}
                onChange={handleCategoryChange}
                onCreateOption={handleCategoryChange}
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                isSearchable
                isClearable
                placeholder="Select a category..."
              />
              <Select
                options={difficultyOptions}
                value={difficulty}
                onChange={handleDifficultyChange}
                isSearchable
                placeholder="Select a difficulty..."
              />
              <Select
                options={languages}
                value={language}
                onChange={handleLanguageChange}
                isSearchable
                placeholder="Select a language..."
              />
              {isTimed && <ProgressBar now={timeElapsed} max={timeLimit} />}
            </Col>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="none"
                onClick={handleReady}
                className={classNames({
                  "disabled": isReady(user),
                  "btn-success": isReady(user),
                  "btn-outline-success": !isReady(user),
                }, "btn-sm btn-round mb-0 me-2")}
              >
                Ready
              </Button>
              { !questionReady && isHost && !gameStarted && allReady && countdown == 0 && (
                <Button className="btn-sm btn-round mb-0 me-3" onClick={handleStartGame}>Start Game</Button>
              )}
              { gameStarted && isHost && (
                <Button className="btn-sm btn-round mb-0 me-3">Stop Game</Button>
              )}
              { gameStarted && allAnswered && (
                <Button className="btn-sm btn-round mb-0 me-3" onClick={handleNextQuestionClick}>Next question</Button>
              )}
            </Card.Footer>
          </Card>
        </Row>
      </Container>
    </section>
  );
};

export default GamePage;