export const API_URL = 'http://localhost:8080/';
export const CHAT_URL = 'ws://localhost:8080/ws';

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
  AVAILABLE_CHAT: 'AVAILABLE_CHAT',
  PING: 'PING',
  ERROR_LEAVING_CHAT: 'ERROR_LEAVING_CHAT',
  CLOSE_CHAT: 'CLOSE_CHAT',
  OPEN_CHAT: 'OPEN_CHAT',
  SET_VOLUNTEER: 'SET_VOLUNTEER',
  REMOVE_STUDENT_FROM_QUEUE: 'REMOVE_STUDENT_FROM_QUEUE',
};

export const CHAT_TYPES = {
  LEKSEHJELP_TEXT: 'LEKSEHJELP_TEXT',
  LEKSEHJELP_VIDEO: 'LEKSEHJELP_VIDEO',
  MESTRING_TEXT: 'MESTRING_TEXT',
  MESTRING_VIDEO: 'MESTRING_VIDEO',
};

export const AZURE_TOKENS = {
  PUBLIC_SAS_TOKEN: process.env.PUBLIC_SAS_TOKEN,
};
