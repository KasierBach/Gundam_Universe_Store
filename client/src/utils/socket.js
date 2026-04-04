import { io } from 'socket.io-client';
import useAuthStore from '../stores/authStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

let socket = null;

export const initiateSocketConnection = () => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return null;

  socket = io(SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    transports: ['websocket'],
  });

  console.log('Connecting to mecha-socket...');
  return socket;
};

export const disconnectSocket = () => {
  console.log('Disconnecting from mecha-socket...');
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;

export const joinConversation = (conversationId) => {
  if (socket) socket.emit('join_conversation', conversationId);
};

export const leaveConversation = (conversationId) => {
  if (socket) socket.emit('leave_conversation', conversationId);
};
