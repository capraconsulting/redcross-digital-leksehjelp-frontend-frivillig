import React, {
  createContext,
  useEffect,
  useReducer,
  useState,
  FunctionComponent,
} from 'react';
import { CHAT_URL, MESSAGE_TYPES } from '../config';
import { IGetMessage, ISocketMessage } from '../interfaces';
import {
  addMessageAction,
  addRoomIDAction,
  chatReducer,
  hasLeftChatAction,
  leaveChatAction,
  reconnectChatAction,
} from '../reducers';
import { IAction, IChat, IStudent } from '../interfaces';

import { toast } from 'react-toastify';
import { number } from 'prop-types';

toast.configure({
  autoClose: 5000,
  draggable: false,
  position: 'top-center',
  closeButton: false,
  closeOnClick: true,
});

export const SocketContext = createContext({
  uniqueID: '' as string,

  chats: [{}] as IChat[],
  dispatchChats(action: IAction): void {},

  queue: [] as IStudent[],
  setQueue(state: IStudent[]): void {},

  socketSend(message: ISocketMessage | IGetMessage): void {},

  activeChatIndex: 0 as number,
  setActiveChatIndex(index: number): void {},
});

let socket;

const getSocket = (): WebSocket => {
  if (!socket) {
    socket = new WebSocket(CHAT_URL);
  }
  return socket;
};

export const SocketProvider: FunctionComponent = ({ children }: any) => {
  const [chats, dispatchChats] = useReducer(chatReducer, []);
  const [activeChatIndex, setActiveChatIndex] = useState<number>(0);
  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<IStudent[]>([]);
  const {
    DISTRIBUTE_ROOM,
    CONNECTION,
    QUEUE_LIST,
    TEXT,
    LEAVE_CHAT,
    ERROR_LEAVING_CHAT,
  } = MESSAGE_TYPES;

  const socketHandler = (message): void => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);
    const { payload, msgType } = parsedMessage;
    if (msgType === TEXT) {
      const action = addMessageAction(
        {
          message: payload['message'],
          author: payload['author'],
          roomID: payload['roomID'],
          uniqueID: payload['uniqueID'],
          datetime: payload['datetime'],
        },
        true,
      );
      dispatchChats(action);
    } else if (msgType === DISTRIBUTE_ROOM) {
      const action = addRoomIDAction(payload['roomID'], payload['studentID']);
      dispatchChats(action);
    } else if (msgType === CONNECTION) {
      setUniqueID(payload['uniqueID']);
    } else if (msgType === QUEUE_LIST) {
      setQueue(payload['queueMembers']);
    } else if (msgType === LEAVE_CHAT) {
      let action;
      if (payload['uniqueID'] === uniqueID) {
        action = leaveChatAction(payload['roomID']);
        toast.success('Du forlot rommet');
      } else {
        action = hasLeftChatAction(payload['roomID'], payload['name']);
      }
      setActiveChatIndex(0);
      dispatchChats(action);
    } else if (msgType === ERROR_LEAVING_CHAT) {
      toast.error('Det skjedde en feil. Du forlot ikke rommet.');
    }
  };

  useEffect(() => {
    getSocket().onmessage = socketHandler;

    // Get chats from sessionStorage and send Reconnect Message to backend
    const chatsFromSessionStorage = localStorage.getItem('chats');
    if (chatsFromSessionStorage) {
      const parsedChatsFromSessionStorage: IChat[] = JSON.parse(
        chatsFromSessionStorage,
      );
      // TODO: send message to backend
      dispatchChats(reconnectChatAction(parsedChatsFromSessionStorage));
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      // Don't set sessionStorage if chats are reset because of reload
      sessionStorage.setItem('chats', JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
    if (!sessionStorage.getItem('oldUniqueID')) {
      sessionStorage.setItem('oldUniqueID', uniqueID);
    }
  }, [uniqueID]);

  const socketSend = (message: ISocketMessage | IGetMessage) => {
    getSocket().send(JSON.stringify(message));
  };
  return (
    <SocketContext.Provider
      value={{
        uniqueID,
        chats,
        dispatchChats,
        queue,
        setQueue,
        socketSend,
        activeChatIndex,
        setActiveChatIndex,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
