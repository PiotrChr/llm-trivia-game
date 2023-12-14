import { useEffect, useState } from 'react';
import {
  getGame,
  endGame,
  getLanguages,
  getCategories,
  isPlaying,
  getUsedLifelines
} from '../../api';
import { useNavigate } from 'react-router-dom';

export const useFetchGameData = (gameId, user, dispatch) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const playing = await isPlaying(gameId);
        if (!isMounted || !playing.data) {
          navigate('/error/unable-to-join-game');
          return;
        }

        const [game, languages, categoriesData, lifelines] = await Promise.all([
          getGame(gameId),
          getLanguages(),
          getCategories(),
          getUsedLifelines(gameId)
        ]);

        if (!isMounted) return;

        // Handle fetched data
        if (!game.data) {
          navigate('/error/unable-to-join-game');
          return;
        }

        if (
          game.data.time_end !== null ||
          (user.id === game.data.host &&
            game.data.max_questions !== 0 &&
            game.data.questions_answered >= game.data.max_questions)
        ) {
          await endGame(gameId);
          dispatch({ type: 'SET_GAME_OVER' });
        } else {
          // Dispatch relevant actions
          dispatch({
            type: 'SET_CATEGORY',
            payload: game.data.current_category
          });
          dispatch({
            type: 'SET_IS_HOST',
            payload: game.data.host === user.id
          });
          dispatch({ type: 'SET_LANGUAGE', payload: game.data.language });
          dispatch({
            type: 'SET_REQUIRED_PLAYERS',
            payload: game.data.players.map((player) => player.player_id)
          });
          dispatch({ type: 'SET_AUTO_START', payload: game.data.auto_start });
          dispatch({ type: 'SET_GAME_MODE', payload: game.data.mode });
          dispatch({ type: 'SET_LIFELINES', payload: game.data.lifelines });
          // dispatch({ type: 'SET_DIFFICULTY', payload: game.data.difficulty });
          dispatch({ type: 'SET_TIME_LIMIT', payload: game.data.time_limit });

          dispatch({
            type: 'SET_LANGUAGES',
            payload: languages.data.map((language) => ({
              label: language.name,
              value: language.iso_code
            }))
          });

          setCategories(
            categoriesData.data.map((category) => ({
              label: category.name,
              value: category.id
            }))
          );

          dispatch({
            type: 'SET_USED_LIFELINES',
            payload: lifelines.data.map((lifeline) => ({
              label: lifeline.name,
              value: lifeline.id
            }))
          });
        }
      } catch (error) {
        console.error('Failed to fetch game data:', error);
        navigate('/error/unable-to-join-game');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [gameId, user.id]);

  return { categories, isLoading };
};
