import { useEffect } from 'react';
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
  hideModal
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const onStarted = () =>
      socket.emit('next', { game_id: gameId, player: user });
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
      handleDisplayResult(data.winners.some((winner) => winner.id === user.id));
      dispatch({ type: 'SET_PLAYER_SCORE', payload: data.winners });
      if (isHost && autoStart) {
        setTimeout(() => handleNextQuestionClick(), 5000);
      }
    };

    socket.on('started', onStarted);
    socket.on('stop', onStop);
    socket.on('pingx', onPing);
    socket.on('countdown', onCountdown);
    socket.on('drawn', onDrawn);
    socket.on('question_ready', onQuestionReady);
    socket.on('message', onMessage);
    socket.on('difficulty_changed', onDifficultyChange);
    socket.on('category_changed', onCategoryChanged);
    socket.on('player_added_to_game', onPlayerAddedToGame);
    socket.on('language_changed', onLanguageChange);
    socket.on('error', onError);
    socket.on('winners', onWinners);

    return () => {
      socket.off('started', onStarted);
      socket.off('stop', onStop);
      socket.off('pingx', onPing);
      socket.off('countdown', onCountdown);
      socket.off('drawn', onDrawn);
      socket.off('question_ready', onQuestionReady);
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
    hideModal
  ]);

  return { socket };
};
