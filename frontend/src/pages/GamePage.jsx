import React, {
  useReducer,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../routing/AuthProvider';
import { useAlert } from '../components/shared/Alert/AlertContext';
import { useModal } from '../components/shared/Modal/ModalContext';
import { initialState, gameReducer } from '../state/gameReducer';
import { useGameSocket } from '../services/hooks/game/useGameSocket';
import { useFetchGameData } from '../services/hooks/game/useFetchGameData';
import GameUI from '../components/Game/GameUI';
import { useTranslation } from 'react-i18next';
import { getRandomBackground } from '../utils';

const GamePage = () => {
  const { user } = useAuth();
  const gameId = useParams().gameId;
  const { showModal, hideModal } = useModal();
  const { showAlert } = useAlert();
  const [displayResult, setDisplayResult] = useState(null);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { t } = useTranslation();
  const displayResultRef = useRef(null);

  const handleDisplayResult = useCallback((winner) => {
    setDisplayResult(winner);

    displayResultRef.current = setTimeout(() => {
      setDisplayResult(null);
    }, 3000);
  }, []);

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
    hideModal,
    state.question,
    state.category,
    state.difficulty,
    state.language,
    state.timer,
    state.selectedAnswerId,
    state.pause
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

  const handleStopGame = useCallback(() => {}, []);

  const handlePauseGame = useCallback(() => {
    if (!socket) return;

    if (state.isHost) {
      socket.emit('pause', { player: user, game_id: gameId });
    }
  }, []);

  const handleResumeGame = useCallback(() => {
    if (!socket) return;

    if (state.isHost) {
      socket.emit('resume', { player: user, game_id: gameId });
    }
  }, []);

  const handleStartGame = useCallback(() => {
    if (!state.allPresent) {
      showAlert(
        t('common.warning'),
        t('game.errors.not_all_players_present'),
        null,
        {
          variant: 'warning',
          position: 'bottom'
        }
      );
      return;
    }
    dispatch({ type: 'START_GAME' });
    if (!socket) return;
    socket.emit('start', { game_id: gameId, player: user });
  }, [socket, state.allPresent, gameId, user, showAlert]);

  const handleAnswerClicked = useCallback(
    (answerId) => {
      if (!socket) return;

      dispatch({ type: 'SELECT_ANSWER', payload: answerId });

      socket.emit('answer', {
        game_id: gameId,
        player: user,
        answer_id: answerId,
        question_id: state.question.id,
        time: 0
      });
    },
    [socket, gameId, user, state.question]
  );

  const isReady = useCallback(
    (player) => {
      return state.players.some(
        (existingPlayer) =>
          existingPlayer.id === player.id && existingPlayer.ready
      );
    },
    [state.players]
  );

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_BACKGROUND',
      payload: getRandomBackground(state.category.id)
    });
  }, [state.category]);

  useEffect(() => {
    return () => {
      clearTimeout(displayResultRef.current);
    };
  }, []);

  useEffect(() => {
    if (!socket || !user || !gameId) return;

    socket.emit('join', { player: user, game_id: gameId });
    socket.emit('pingx', { player: user, game_id: gameId });

    return () => {
      socket.emit('leave', { player: user, game_id: gameId });
    };
  }, [socket, gameId, user]);

  useEffect(() => {
    if (!socket) return;

    if (state.allAnswered && state.isHost) {
      socket.emit('get_winners', {
        game_id: gameId,
        question_id: state.question.id
      });
    }
  }, [state.allAnswered, socket, state.question]);

  useEffect(() => {
    if (!socket) return;

    if (
      state.timeLimit > 0 &&
      state.timer !== null &&
      state.timer === 0 &&
      !state.selectedAnswerId
    ) {
      socket.emit('miss', {
        game_id: gameId,
        player: user,
        question_id: state.question.id
      });
    }
  }, [state.timeLimit, state.timer, state.selectedAnswerId]);

  return (
    <GameUI
      gameId={gameId}
      state={state}
      categories={categories}
      displayResult={displayResult}
      user={user}
      isReady={isReady}
      currentBackground={state.currentBackground}
      handleCategoryChange={handleCategoryChange}
      handleLanguageChange={handleLanguageChange}
      handleSendMessage={handleSendMessage}
      handleDisplayResult={handleDisplayResult}
      handleDifficultyChange={handleDifficultyChange}
      handleReady={handleReady}
      handleStartGame={handleStartGame}
      handleStopGame={handleStopGame}
      handlePauseGame={handlePauseGame}
      handleResumeGame={handleResumeGame}
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
