import { io } from "socket.io-client";

const API_HOST = process.env.BACKEND_HOST || 'localhost';
const API_PORT = process.env.BACKEND_PORT || 9000;
const BASE_URL = `http://${API_HOST}:${API_PORT}`;

export const socket = io(BASE_URL);
