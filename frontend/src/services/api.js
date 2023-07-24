import axios from 'axios';
import Cookies from 'js-cookie';

const API_HOST = process.env.BACKEND_HOST || 'localhost';
const API_PORT = process.env.BACKEND_PORT || 9000;
const BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

// Create an axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
  });

api.interceptors.request.use((config) => {
    // add Authorization header to every request
    const token = Cookies.get('token'); 
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

// Authentication

export const signup = async (username, email, password) => {
  const response = await api.post(`${BASE_URL}/auth/signup`, { username, email, password });
  Cookies.set('token', response.data.access_token);
  Cookies.set('refresh_token', response.data.refresh_token)
  Cookies.set('username', response.data.refresh_token)
  return response;
};

export const login = async (username, password) => {
    const response = await api.post(`${BASE_URL}/auth/login`, { username, password });
    Cookies.set('token', response.data.access_token);
    Cookies.set('refresh_token', response.data.refresh_token)
    return response;
}

export const logout = async () => {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
}

export const checkAuth = async () => {
    const response = await api.get(`${BASE_URL}/auth/check`);
    return response;
}

// Users

export const getUsers = async () => {
    const response = await api.get(`${BASE_URL}/users`);
    return response;
}

export const getUser = async (id) => {
    const response = await api.get(`${BASE_URL}/users/${id}`);
    return response;
}

// Games

export const getGames = async () => {
    const response = await api.get(`${BASE_URL}/games`);
    return response;
}

export const getGame = async (id) => {
    const response = await api.get(`${BASE_URL}/games/${id}`);
    return response;
}
