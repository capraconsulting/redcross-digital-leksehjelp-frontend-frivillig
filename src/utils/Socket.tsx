import { CHAT_URL } from '../config';
import { IGetMessage, ISocketMessage } from '../interfaces';

let socket;

export const getSocket = (): WebSocket => {
  if (!socket) socket = new WebSocket(CHAT_URL);
  localStorage.setItem('socket', socket);
  return socket;
};

export const socketSend = (message: ISocketMessage | IGetMessage) => {
  socket.send(JSON.stringify(message));
};
