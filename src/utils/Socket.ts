import { CHAT_URL } from '../config';

let socket;

export const getSocket = (): WebSocket => {
  if (!socket) socket = new WebSocket(CHAT_URL);
  return socket;
};
