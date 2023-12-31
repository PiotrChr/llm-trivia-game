import { useEffect, useRef } from 'react';
import { useSocket } from '../useSocket';

export const useGameSocket = (
  gameId,
  user,
  dispatch,
  showAlert,
  handleDisplayResult,
  isHost,
  autoStart,
  handleNextQuestionClick,
  showModal,
  hideModal,
  question,
  category,
  difficulty,
  language,
  timer,
  selectedAnswerId,
  pause
) => {
  const socket = useSocket();

  const timerRef = useRef(timer);
  const intervalRef = useRef(null);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    if (!socket) return;

    const onStarted = () =>
      socket.emit('next', {
        game_id: gameId,
        player: user,
        category: category.id,
        difficulty,
        language: language.iso_code
      });
    const onStop = () => dispatch({ type: 'STOP_GAME' });
    const onPing = () =>
      socket.emit('pongx', { player: user, game_id: gameId });
    const onCountdown = (data) =>
      dispatch({ type: 'SET_COUNTDOWN', payload: data });
    const onDrawn = () => dispatch({ type: 'SET_DRAWING', payload: false });
    const onQuestionReady = (data) => {
      dispatch({ type: 'SET_QUESTION', payload: data.next_question });
      dispatch({ type: 'SET_ANSWERS', payload: data.next_question.answers });
      dispatch({ type: 'SET_QUESTION_READY' });
    };
    const onMessage = (data) =>
      dispatch({ type: 'ADD_MESSAGE', payload: data });
    const onDifficultyChange = (data) =>
      dispatch({ type: 'SET_DIFFICULTY', payload: data.difficulty });
    const onCategoryChanged = (data) =>
      dispatch({ type: 'SET_CATEGORY', payload: data.category });
    const onPlayerAddedToGame = (data) =>
      dispatch({ type: 'ADD_REQUIRED_PLAYER', payload: data.player_id });
    const onLanguageChange = (data) =>
      dispatch({
        type: 'SET_LANGUAGE',
        payload: { name: data.name, iso_code: data.iso_code }
      });
    const onError = (data) =>
      showAlert('Error', data.msg, null, {
        variant: 'danger',
        position: 'bottom'
      });
    const onWinners = (data) => {
      console.log(data.winners);
      handleDisplayResult(data.winners.some((winner) => winner.id === user.id));
      dispatch({ type: 'SET_PLAYER_SCORE', payload: data.winners });
      if (isHost && autoStart) {
        setTimeout(() => handleNextQuestionClick(), 5000);
      }
    };
    const onIsReady = (data) => {
      dispatch({ type: 'SET_PLAYER_READY', payload: data.player.id });
    };
    const onJoined = (data) => dispatch({ type: 'ADD_PLAYER', payload: data });
    const onDrawing = () => {
      dispatch({ type: 'RESET_ROUND' });
      dispatch({ type: 'SET_DRAWING', payload: true });
    };
    const onLeft = (data) => {
      dispatch({ type: 'REMOVE_PLAYER', payload: data.player });
    };
    const onPong = (data) => dispatch({ type: 'ADD_PLAYER', payload: data });
    const onAnswered = (data) => {
      dispatch({ type: 'SET_PLAYER_ANSWER', payload: data });
    };

    const resumeTimer = () => {
      intervalRef.current = setInterval(() => {
        if (timerRef.current === 0) {
          clearInterval(intervalRef.current);
        } else {
          dispatch({ type: 'DECREMENT_TIMER' });
        }
      }, 1000);
    };
    const onStartTimer = (data) => {
      dispatch({ type: 'SET_TIMER', payload: data.time_limit });

      resumeTimer();
    };
    const onMissedQuestion = (data) => {
      const player_id = data.player.id;
      dispatch({ type: 'MISS_ANSWER', payload: player_id });
    };

    const onGameOver = (data) => {
      dispatch({ type: 'SET_GAME_OVER' });
    };

    const onPause = () => {
      dispatch({ type: 'SET_PAUSE', payload: true });

      console.log('pausing');

      clearInterval(intervalRef.current);
    };

    const onResume = () => {
      dispatch({ type: 'SET_PAUSE', payload: false });

      console.log('resuming');

      resumeTimer();
    };

    socket.on('pause', onPause);
    socket.on('resume', onResume);
    socket.on('gave_over', onGameOver);
    socket.on('answer_missed', onMissedQuestion);
    socket.on('start_timer', onStartTimer);
    socket.on('drawing', onDrawing);
    socket.on('left', onLeft);
    socket.on('answered', onAnswered);
    socket.on('pongx', onPong);
    socket.on('started', onStarted);
    socket.on('stop', onStop);
    socket.on('pingx', onPing);
    socket.on('joined', onJoined);
    socket.on('countdown', onCountdown);
    socket.on('drawn', onDrawn);
    socket.on('question_ready', onQuestionReady);
    socket.on('is_ready', onIsReady);
    socket.on('message', onMessage);
    socket.on('difficulty_changed', onDifficultyChange);
    socket.on('category_changed', onCategoryChanged);
    socket.on('player_added_to_game', onPlayerAddedToGame);
    socket.on('language_changed', onLanguageChange);
    socket.on('error', onError);
    socket.on('winners', onWinners);

    return () => {
      socket.off('resume', onResume);
      socket.off('pause', onPause);
      socket.off('gave_over', onGameOver);
      socket.off('answer_missed', onMissedQuestion);
      socket.off('start_timer', onStartTimer);
      socket.off('drawing', onDrawing);
      socket.off('left', onLeft);
      socket.off('answered', onAnswered);
      socket.off('pongx', onPong);
      socket.off('started', onStarted);
      socket.off('stop', onStop);
      socket.off('pingx', onPing);
      socket.off('countdown', onCountdown);
      socket.off('drawn', onDrawn);
      socket.off('question_ready', onQuestionReady);
      socket.off('is_ready', onIsReady);
      socket.off('message', onMessage);
      socket.off('difficulty_changed', onDifficultyChange);
      socket.off('category_changed', onCategoryChanged);
      socket.off('player_added_to_game', onPlayerAddedToGame);
      socket.off('language_changed', onLanguageChange);
      socket.off('error', onError);
      socket.off('winners', onWinners);
    };
  }, [
    socket,
    gameId,
    user,
    dispatch,
    showAlert,
    handleDisplayResult,
    isHost,
    autoStart,
    handleNextQuestionClick,
    showModal,
    hideModal,
    question,
    timer,
    pause
  ]);

  useEffect(() => {
    if (timer === 0 || selectedAnswerId !== null) {
      clearInterval(intervalRef.current);
    }
  }, [timer, selectedAnswerId]);

  return { socket };
};
