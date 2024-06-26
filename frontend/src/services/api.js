import axios from 'axios';
import Cookies from 'js-cookie';

/* eslint-disable no-undef */
const API_HOST = process.env.BACKEND_HOST || 'localhost';
const API_PORT =
  process.env.BACKEND_PORT_PUBLIC !== ''
    ? `:${process.env.BACKEND_PORT_PUBLIC}`
    : '';

const BASE_URL = `${API_HOST}${API_PORT}/api`;
/* eslint-enable no-undef */

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

// Authentication

export const signup = async (username, email, password) => {
  const response = await api.post(`${BASE_URL}/auth/signup`, {
    username,
    email,
    password
  });
  Cookies.set('token', response.data.access_token);
  Cookies.set('refresh_token', response.data.refresh_token);
  return response;
};

export const login = async (username, password) => {
  const response = await api.post(`${BASE_URL}/auth/login`, {
    username,
    password
  });
  return response;
};

export const logout = async () => {
  Cookies.remove('token');
  Cookies.remove('refresh_token');
};

export const checkAuth = async () => {
  const response = await api.get(`${BASE_URL}/auth/check`);
  return response;
};

export const authGoogle = async (token, auth_code) => {
  const response = await api.post(`${BASE_URL}/auth/google`, {
    token,
    auth_code
  });
  return response;
};

// Players

export const getUsers = async () => {
  const response = await api.get(`${BASE_URL}/players`);
  return response;
};

export const getUser = async (id) => {
  const response = await api.get(`${BASE_URL}/players/${id}`);
  return response;
};

export const getProfileStats = async () => {
  const response = await api.get(`${BASE_URL}/players/stats`);
  return response;
};

export const getFriends = async () => {
  const response = await api.get(`${BASE_URL}/players/friends`);
  return response;
};

export const getInvitations = async () => {
  const response = await api.get(`${BASE_URL}/players/friends/invitations`);
  return response;
};

export const inviteFriend = async (playerId) => {
  const response = await api.post(`${BASE_URL}/players/friends/invite`, {
    playerId
  });
  return response;
};

export const acceptFriend = async (playerId) => {
  const response = await api.post(`${BASE_URL}/players/friends/accept`, {
    playerId
  });
  return response;
};

export const declineFriend = async (playerId) => {
  const response = await api.post(`${BASE_URL}/players/friends/decline`, {
    playerId
  });
  return response;
};

export const removeFriend = async (userId) => {
  const response = await api.delete(`${BASE_URL}/players/friends`, {
    userId
  });
  return response;
};

export const searchUserByString = async (searchString) => {
  const response = await api.get(`${BASE_URL}/players/friends/search`, {
    params: {
      string: searchString
    }
  });
  return response;
};

// Games

export const getGames = async () => {
  const response = await api.get(`${BASE_URL}/game/`);
  return response;
};

export const getGame = async (id) => {
  const response = await api.get(`${BASE_URL}/game/${id}`);
  return response;
};

export const getGameModes = async () => {
  const response = await api.get(`${BASE_URL}/game/modes`);
  return response;
};

export const getGameStats = async (id) => {
  const response = await api.get(`${BASE_URL}/game/${id}/stats`);
  return response;
};

export const createGame = async (
  gameMode,
  password,
  categories,
  allCategories,
  timeLimit,
  maxQuestions,
  maxPlayers,
  language,
  autoStart,
  eliminateOnFail,
  selectedLifelines,
  isPublic
) => {
  const response = await api.post(`${BASE_URL}/game/create`, {
    gameMode,
    password,
    categories,
    allCategories,
    timeLimit,
    maxQuestions,
    maxPlayers,
    language,
    autoStart,
    eliminateOnFail,
    selectedLifelines,
    isPublic
  });
  return response;
};

export const joinGame = async (gameId, password) => {
  const response = await api.post(`${BASE_URL}/game/join`, {
    game_id: gameId,
    password
  });
  return response;
};

export const startGame = async (gameId) => {
  const response = await api.post(`${BASE_URL}/game/start`, {
    game_id: gameId
  });
  return response;
};

export const endGame = async (gameId) => {
  const response = await api.post(`${BASE_URL}/game/end_game`, { gameId });
  return response;
};

export const isPlaying = async (gameId) => {
  const response = await api.get(`${BASE_URL}/game/${gameId}/is_playing`);
  return response;
};

export const getLeaderboard = async () => {
  const response = await api.get(`${BASE_URL}/game/leaderboard`);
  return response;
};

// Categories

export const getCategories = async () => {
  const response = await api.get(`${BASE_URL}/category/`);
  return response;
};

export const submitCategory = async (categoryName, language) => {
  const response = await api.post(`${BASE_URL}/category/submit`, {
    categoryName,
    language
  });
  return response;
};

// Languages

export const getLanguages = async () => {
  const response = await api.get(`${BASE_URL}/language/`);
  return response;
};

// Questions

export const reportQuestion = async (questionId, reportData) => {
  const response = await api.post(
    `${BASE_URL}/questions/${questionId}/report`,
    {
      reportData
    }
  );

  return response;
};

export const submitQuestion = async (
  question,
  answers,
  category,
  difficulty,
  language
) => {
  const response = await api.post(`${BASE_URL}/questions/submit`, {
    question,
    answers,
    category,
    difficulty,
    language
  });
  return response;
};

// Notifications

export const getNotifications = async () => {
  const response = await api.get(`${BASE_URL}/notifications/`);
  return response;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.post(
    `${BASE_URL}/notifications/${notificationId}/mark_as_read`
  );
  return response;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.post(`${BASE_URL}/notifications/mark_all_as_read`);
  return response;
};

export const clearNotifications = async () => {
  const response = await api.delete(`${BASE_URL}/notifications/clear`);
  return response;
};

export const removeInvitation = async (notificationId) => {
  const response = await api.delete(
    `${BASE_URL}/notifications/${notificationId}`
  );
  return response;
};

// Lifelines

export const getLifelineTypes = async () => {
  const response = await api.get(`${BASE_URL}/lifelines/types`);
  return response;
};

export const getUsedLifelines = async (gameId) => {
  const response = await api.get(`${BASE_URL}/lifelines/${gameId}/used`);
  return response;
};

export const useLifeline = async (gameId, questionId, lifeline) => {
  const response = await api.post(`${BASE_URL}/lifelines/${gameId}/use`, {
    gameId,
    questionId,
    lifeline
  });
  return response;
};
