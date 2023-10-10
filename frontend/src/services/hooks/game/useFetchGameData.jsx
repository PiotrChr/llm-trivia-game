import { useEffect, useState } from 'react';
import { getGame, getLanguages, getCategories, isPlaying } from '../../api';
import { useNavigate } from 'react-router-dom';

export const useFetchGameData = (gameId, user, dispatch) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
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
        dispatch({ type: 'SET_LANGUAGE', payload: game.data.language });
        dispatch({
          type: 'SET_REQUIRED_PLAYERS',
          payload: game.data.players.map((player) => player.player_id)
        });
        dispatch({ type: 'SET_AUTO_START', payload: game.data.auto_start });
        dispatch({ type: 'SET_GAME_MODE', payload: game.data.mode });
      } catch (error) {
        console.error('Failed to fetch game:', error);
        navigate('/error/unable-to-join-game');
      }
    };

    const fetchLanguages = async () => {
      try {
        const result = await getLanguages();
        dispatch({
          type: 'SET_LANGUAGES',
          payload: result.data.map((language) => ({
            label: language.name,
            value: language.iso_code
          }))
        });
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(
          result.data.map((category) => ({
            label: category.name,
            value: category.id
          }))
        );
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchGame();
    fetchLanguages();
    fetchCategories();
    setIsLoading(false);
  }, [gameId, user.id, navigate, dispatch]);

  return { categories, isLoading };
};
