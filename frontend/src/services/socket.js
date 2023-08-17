import { io } from 'socket.io-client';

/* eslint-disable no-undef */
const API_HOST = process.env.BACKEND_HOST || 'localhost';
const API_PORT = process.env.BACKEND_PORT || 9000;
const BASE_URL = `http://${API_HOST}:${API_PORT}`;
/* eslint-enable no-undef */

export const socket = io(BASE_URL);
