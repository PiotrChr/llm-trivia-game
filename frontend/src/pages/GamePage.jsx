import React, { useCallback, useEffect, useState, useReducer, useMemo } from 'react';
import { Button, Col, Container, ProgressBar, Row, Card, Fade } from 'react-bootstrap';
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
import { initialState, gameReducer } from '../state/gameReducer';
import FadeInOut from '../components/shared/FadeInOut';

const GamePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(gameReducer, initialState);
  const {
    category,
    difficulty,
    question,
    players,
    messages,
    answers,
    countdown,
    timeElapsed,
    isTimed,
    timeLimit,
    allAnswered,
    selectedAnswerId,
    isHost,
    gameStarted,
    questionReady,
    drawing,
    languages,
    language,
    allReady,
    currentBackground
  } = state;

  const [categories, setCategories] = useState([]);
  const gameId = useParams().gameId;

  const difficultyOptions = useMemo(() => 
    Array.from({length: 5}, (_, i) => ({ label: `Level ${i+1}`, value: i+1 })),
  [],);
  
  const handleCategoryChange = useCallback((newValue, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      dispatch({ type: 'ADD_CATEGORY', payload: newValue });
      socket.emit('category_changed', { game_id: gameId, new_category: newValue.value})
    } else {
      socket.emit('category_changed', { game_id: gameId, category: { name: newValue.label, id: newValue.value  }})
    }
  }, []);

  const handleLanguageChange = useCallback((newValue) => {
    dispatch({ type: 'SET_LANGUAGE', payload: {
      name: newValue.label,
      iso_code: newValue.value
    } });
  }, []);

  const handleSendMessage = useCallback((message) => {
    socket.emit('message', { game_id: gameId, player: user, message: message });
  }, []);

  const isReady = useCallback((player) => {
    return players.some(existingPlayer => existingPlayer.id === player.id && existingPlayer.ready);
  }, [players]);

  const handleDifficultyChange = useCallback((selectedOption) => {
    socket.emit('difficulty_changed', { game_id: gameId, difficulty: selectedOption.value });
  }, []);

  const handleReady = useCallback(() => {
    socket.emit('ready', { player: user, game_id: gameId });
  }, []);

  const handleStartGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
    socket.emit('start', { game_id: gameId, player: user });
  }, []);

  const handleAnswerClicked = useCallback((answerId) => {
    dispatch({ type: 'SELECT_ANSWER', payload: answerId });
    socket.emit('answer', { game_id: gameId, player: user, answer_id: answerId, question_id: question.id });
  }, [question]);

  const handleNextQuestionClick = useCallback(() => {
    dispatch({ type: 'RESET_ROUND' });
    socket.emit('next', {game_id: gameId, player: user, category: category.id, difficulty, language: language.iso_code });
  }, [difficulty, category]);

  useEffect(() => dispatch(
    { type: 'SET_CURRENT_BACKGROUND', payload: getRandomBackground(category['id']) }), [category['id']]
  );

  useEffect(() => {
    const fetchGame = async () => {
      const playing = await isPlaying(gameId);
      if (!playing.data) {
        navigate('/error/unable-to-join-game');
        return;
      }

      const game = await getGame(gameId);
      if (!game.data) {
        navigate('/error/unable-to-join-game');
        return;
      }

      dispatch({ type: 'SET_CATEGORY', payload: game.data.current_category });
      dispatch({ type: 'SET_IS_HOST', payload: game.data.host === user.id });
    };
    const fetchLanguages = async () => {
      const result = await getLanguages();
      dispatch({ type: 'SET_LANGUAGES', payload: result.data.map(language => ({ label: language.name, value: language.iso_code })) });
      
    };
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result.data.map(category => ({ label: category.name, value: category.id })));
    };

    fetchGame();
    fetchLanguages();
    fetchCategories();
  }, []);

  useEffect(() => {
    const onStop = () => dispatch({ type: 'STOP_GAME' });
    const onPing = () => socket.emit('pong', { player: user, game_id: gameId });
    const onCountdown = (data) => dispatch({ type: 'SET_COUNTDOWN', payload: data });
    const onDrawn = () => dispatch({ type: 'SET_DRAWING', payload: false });
    const onQuestionReady = (data) => {
      dispatch({ type: 'SET_QUESTION', payload: data.next_question });
      dispatch({ type: 'SET_ANSWERS', payload: data.next_question.answers });
      dispatch({ type: 'SET_QUESTION_READY' });
    };
    const onMessage = (data) => dispatch({ type: 'ADD_MESSAGE', payload: data });
    const onDifficultyChange = (data) => dispatch({ type: 'SET_DIFFICULTY', payload: data.difficulty });
    const onCategoryChanged = (data) => dispatch({ type: 'SET_CATEGORY', payload: data.category });

    socket.emit('ping', {game_id: gameId});
    socket.emit('join', { player: user, game_id: gameId });

    socket.on('category_changed', onCategoryChanged)
    socket.on('difficulty_changed', onDifficultyChange)
    socket.on('question_ready', onQuestionReady)
    socket.on('drawn', onDrawn)
    socket.on('countdown', onCountdown);
    socket.on('ping', onPing);
    socket.on('stop', onStop);
    socket.on('message', onMessage);
    
    return () => {
      socket.off('category_changed', onCategoryChanged)
      socket.off('difficulty_changed', onDifficultyChange)
      socket.off('question_ready', onQuestionReady)
      socket.off('drawn', onDrawn)
      socket.off('countdown', onCountdown);
      socket.off('ping', onPing);
      socket.off('stop', onStop);
      socket.off('message', onMessage);
      socket.emit('leave', { player: user, game_id: gameId });
    };
  }, []);

  useEffect(() => {
    const onStarted = () => {
      socket.emit('next', {game_id: gameId, player: user, category: category.id, difficulty, language: language.iso_code});
    };

    socket.on('started', onStarted);

    return () => {
      socket.off('started', onStarted);
    }
  }, [difficulty, category]);

  useEffect(() => { 
    const onIsReady = (data) => dispatch({ type: 'SET_PLAYER_READY', payload: data.player.id });
    const onJoined = (data) => dispatch({ type: 'ADD_PLAYER', payload: data });
    const onLeft = (data) => dispatch({ type: 'REMOVE_PLAYER', payload: data.player });
    const onPong = (data) => dispatch({ type: 'ADD_PLAYER', payload: data.player });
    const onAnswered = (data) => { dispatch({ type: 'SET_PLAYER_ANSWER', payload: data }) };
    const onDrawing = () => dispatch({ type: 'SET_DRAWING', payload: true });
    const onWinners = (data) => {
      dispatch({ type: 'SET_PLAYER_SCORE', payload: data.winners })
    };

    socket.on('winners', onWinners)
    socket.on('drawing', onDrawing)
    socket.on('answered', onAnswered);
    socket.on('joined', onJoined);
    socket.on('left', onLeft);
    socket.on('is_ready', onIsReady);
    socket.on('pong', onPong);
    
    return () => {
      socket.off('winners', onWinners)
      socket.off('drawing', onDrawing)
      socket.off('answered', onAnswered);
      socket.off('joined', onJoined);
      socket.off('left', onLeft);
      socket.off('is_ready', onIsReady);
      socket.off('pong', onPong);
    }
  }, [players, isHost, question]);

  const backgroundStyle = useMemo(() => ({
      backgroundImage: `url(${currentBackground})`,
      borderRadius: '0px 0px 24px 24px',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
  }), [currentBackground]);

  useEffect(() => {
    if (allAnswered && isHost) {
      socket.emit('get_winners', { game_id: gameId, question_id: question.id });
    }
  }, [allAnswered]);
    
  console.log('allAnswered', allAnswered);
  console.log('players', players);
  console.log('countdown', countdown);
  console.log('drawing', drawing);
  console.log('questionReady', questionReady);
  
  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={backgroundStyle}
      >
        <span className="mask bg-gradient-dark opacity-6"></span>
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} className="text-center mx-auto">
              <h1 className="text-white mb-2 mt-10">{ category.name }</h1>
              <p className="text-lead text-white">Current difficulty: { difficulty }</p>
              <p className="text-lead text-white">Current language: { language.name }</p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="mt-lg-n10 mt-md-n11 mt-n10">
          <Card>
            <Card.Body className='row'>
              <Col xs={8} className='position-relative'>
                <FadeInOut
                  show={questionReady}
                  duration={500}
                  className="position-absolute"
                  style={{left: '0px', right: '0px'}}>
                  <QuestionCard
                    question={question}
                    answers={answers}
                    handleAnswerClicked={handleAnswerClicked}
                    selectedAnswerId={selectedAnswerId}
                    player_answers={
                      allAnswered ? players.map(player => player.answer && ({
                        player: player.id,
                        answer_id: player.answer
                      })) : []
                    }
                  />
                </FadeInOut>
                <FadeInOut
                  show={!questionReady && (countdown.remaining_time > 0 || drawing)}
                  duration={500}
                  className="position-absolute"
                  style={{left: '0px', right: '0px'}}>
                  <Countdown
                      secondsLeft={countdown.remaining_time}
                      secondsTotal={countdown.total_time}
                      title={ drawing ? 'Drawing a question' : 'Countdown' }
                      showProgressBar={!drawing}
                    /> 
                </FadeInOut>
              </Col>
              <Col xs={4}>
                <Sidebar players={players} playerId={user.id} messages={messages} sendMessage={handleSendMessage} />
                { isTimed && <ProgressBar now={timeElapsed} max={timeLimit} /> }
              </Col>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col size={12}>
                  <Button variant="none" onClick={handleReady}
                    className={classNames({
                      "disabled": isReady(user),
                      "btn-success": isReady(user),
                      "btn-outline-success": !isReady(user),
                    }, "btn-sm btn-round mb-0 me-2")}>
                    Ready
                  </Button>
                  { isHost && !gameStarted && allReady && (
                    <Button className="btn-sm btn-round mb-0 me-3" onClick={handleStartGame}>Start Game</Button>
                  )}
                  { gameStarted && isHost && (
                    <Button className="btn-sm btn-round mb-0 me-3">Stop Game</Button>
                  )}
                  { gameStarted && allAnswered && (
                    <Button className="btn-sm btn-round mb-0 me-3" onClick={handleNextQuestionClick}>Next question</Button>
                  )}
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col xs={12} lg={4} md={4}>
                  <Select
                    options={categories}
                    value={ { label: category.name, value: category.id } }
                    onChange={handleCategoryChange}
                    onCreateOption={handleCategoryChange}
                    formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                    isSearchable
                    isClearable
                  />
                </Col>
                <Col xs={12} lg={4} md={4}>
                  <Select
                    options={difficultyOptions}
                    value={ difficultyOptions[difficulty-1] }
                    onChange={handleDifficultyChange}
                    isSearchable
                  />
                </Col>
                <Col xs={12} lg={4} md={4}>
                  <Select
                    options={languages}
                    value={ { label: language.name, value: language.iso_code } }
                    onChange={handleLanguageChange}
                    isSearchable
                    defaultValue={ { label: 'English', value: 'en' } }
                  />
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Row>
      </Container>
    </section>
  );
};

// GamePage.whyDidYouRender = true;

export default GamePage;