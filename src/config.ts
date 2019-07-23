export const API_URL = 'http://localhost:8080/';
export const CHAT_URL = 'ws://localhost:3002/events';
export const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const MESSAGE_TYPES = {
  CONNECTION: 'CONNECTION',
  ENTER_QUEUE: 'ENTER_QUEUE',
  DISTRIBUTE_ROOM: 'DISTRIBUTE_ROOM',
  GENERATE_ROOM: 'GENERATE_ROOM',
  QUEUE_LIST: 'QUEUE_LIST',
  TEXT: 'TEXT',
  JOIN_CHAT: 'JOIN_CHAT',
  LEAVE_CHAT: 'LEAVE_CHAT',
  AVAILABLE_CHAT: 'AVAILABLE_CHAT',
};
