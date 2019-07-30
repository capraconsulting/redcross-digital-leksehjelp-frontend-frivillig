export const API_URL = 'http://localhost:8080/';
export const CHAT_URL = 'ws://localhost:3002/events';

const token = sessionStorage ? sessionStorage.getItem('msal.idtoken') : '';
export const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

export const MESSAGE_TYPES = {
  CONNECTION: 'CONNECTION',
  RECONNECT: 'RECONNECT',
  ENTER_QUEUE: 'ENTER_QUEUE',
  DISTRIBUTE_ROOM: 'DISTRIBUTE_ROOM',
  GENERATE_ROOM: 'GENERATE_ROOM',
  QUEUE_LIST: 'QUEUE_LIST',
  TEXT: 'TEXT',
  JOIN_CHAT: 'JOIN_CHAT',
  LEAVE_CHAT: 'LEAVE_CHAT',
  ERROR_LEAVING_CHAT: 'ERROR_LEAVING_CHAT',
};
