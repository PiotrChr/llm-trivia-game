// api.js
import axios from 'axios';

const API_HOST = process.env.BACKEND_HOST || 'localhost';
const API_PORT = process.env.BACKEND_SERVER_PORT || 9000;
const BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

// Create an axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
  });

// Authentication

export const signup = async (username, email, password) => {
  const response = await api.post(`${BASE_URL}/auth/signup`, { username, email, password });
  return response;
};

export const login = async (username, password) => {
    const response = await api.post(`${BASE_URL}/auth/login`, { username, password });
    return response;
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
