import React, { useReducer, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../routing/AuthProvider';
import { useAlert } from '../components/shared/Alert/AlertContext';
import { useModal } from '../components/shared/Modal/ModalContext';
import { initialState, gameReducer } from '../state/gameReducer';
import { useGameSocket } from '../services/hooks/game/useGameSocket';
import { useFetchGameData } from '../services/hooks/game/useFetchGameData';
import GameUI from '../components/Game/GameUI';

const GamePage = () => {
  const { user } = useAuth();
  const gameId = useParams().gameId;
  const { showModal, hideModal } = useModal();
  const { showAlert } = useAlert();
  const [displayResult, setDisplayResult] = useState(null);
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const { socket } = useGameSocket(
    gameId,
    user,
    dispatch,
    showAlert,
    handleDisplayResult,
    state.isHost,
    state.autoStart,
    handleNextQuestionClick,
    showModal,
    hideModal
  );
  const { categories, isLoading } = useFetchGameData(gameId, user, dispatch);

  const handleCategoryChange = useCallback(
    (newValue, actionMeta) => {
      if (!socket) return;
      if (actionMeta.action === 'create-option') {
        dispatch({ type: 'ADD_CATEGORY', payload: newValue });
        socket.emit('category_changed', {
          game_id: gameId,
          new_category: newValue.value
        });
      } else {
        socket.emit('category_changed', {
          game_id: gameId,
          category: { name: newValue.label, id: newValue.value }
        });
      }
    },
    [socket, gameId]
  );

  const handleLanguageChange = useCallback(
    (newValue) => {
      if (!socket) return;
      socket.emit('language_changed', {
        game_id: gameId,
        language: newValue.value
      });
    },
    [socket, gameId]
  );

  const handleSendMessage = useCallback(
    (message) => {
      if (!socket) return;
      socket.emit('message', {
        game_id: gameId,
        player: user,
        message: message
      });
    },
    [socket, gameId, user]
  );

  const handleDisplayResult = useCallback((winner) => {
    setDisplayResult(winner);
    const timeout = setTimeout(() => {
      setDisplayResult(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleDifficultyChange = useCallback(
    (selectedOption) => {
      if (!socket) return;
      socket.emit('difficulty_changed', {
        game_id: gameId,
        difficulty: selectedOption.value
      });
    },
    [socket, gameId]
  );

  const handleReady = useCallback(() => {
    if (!socket) return;
    socket.emit('ready', { player: user, game_id: gameId });
  }, [socket, gameId, user]);

  const handleStartGame = useCallback(() => {
    if (!state.allPresent) {
      showAlert('Warning', 'Not all players are present!', null, {
        variant: 'warning',
        position: 'bottom'
      });
      return;
    }
    dispatch({ type: 'START_GAME' });
    if (!socket) return;
    socket.emit('start', { game_id: gameId, player: user });
  }, [socket, state.allPresent, gameId, user, showAlert]);

  const handleAnswerClicked = useCallback(
    (answerId) => {
      dispatch({ type: 'SELECT_ANSWER', payload: answerId });
      if (!socket) return;
      socket.emit('answer', {
        game_id: gameId,
        player: user,
        answer_id: answerId,
        question_id: state.question.id
      });
    },
    [socket, gameId, user, state.question]
  );

  const handleNextQuestionClick = useCallback(() => {
    if (!socket) return;
    socket.emit('next', {
      game_id: gameId,
      player: user,
      category: state.category.id,
      difficulty: state.difficulty,
      language: state.language.iso_code
    });
  }, [socket, gameId, user, state.category, state.difficulty, state.language]);

  const isReady = useCallback(
    (player) => {
      return state.players.some(
        (existingPlayer) =>
          existingPlayer.id === player.id && existingPlayer.ready
      );
    },
    [state.players]
  );

  return (
    <GameUI
      state={state}
      categories={categories}
      displayResult={displayResult}
      user={user}
      isReady={isReady}
      handleCategoryChange={handleCategoryChange}
      handleLanguageChange={handleLanguageChange}
      handleSendMessage={handleSendMessage}
      handleDisplayResult={handleDisplayResult}
      handleDifficultyChange={handleDifficultyChange}
      handleReady={handleReady}
      handleStartGame={handleStartGame}
      handleAnswerClicked={handleAnswerClicked}
      handleNextQuestionClick={handleNextQuestionClick}
      showModal={showModal}
      hideModal={hideModal}
      isLoading={isLoading}
      difficultyOptions={useMemo(
        () =>
          Array.from({ length: 5 }, (_, i) => ({
            label: `Level ${i + 1}`,
            value: i + 1
          })),
        []
      )}
    />
  );
};

export default GamePage;
