import React, { createContext, useEffect, useReducer, useState } from 'react';
import { CHAT_URL, MESSAGE_TYPES } from '../config';
import { IGetMessage, ISocketMessage } from '../interfaces';
import {
  addMessage,
  addRoomID,
  chatReducer,
  setChatFromLocalStorage,
} from '../reducers';
import { IAction, IChat, IStudent } from '../interfaces';

export const SocketContext = createContext({
  uniqueID: '' as string,

  chats: [] as IChat[],
  dispatchChats(action: IAction) {},

  queue: [] as IStudent[],
  setQueue(state: IStudent[]) {},

  socketSend(message: ISocketMessage | IGetMessage): void {},
});

let socket;

const getSocket = (): WebSocket => {
  if (!socket) {
    socket = new WebSocket(CHAT_URL);
  }
  return socket;
};

export const SocketProvider: React.FunctionComponent = ({ children }: any) => {
  const [chats, dispatchChats] = useReducer(chatReducer, []);
  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<IStudent[]>([]);

  const socketHandler = (message): void => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);
    const { payload, msgType } = parsedMessage;
    if (msgType === MESSAGE_TYPES.TEXT) {
      const action = addMessage(
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
    } else if (msgType === MESSAGE_TYPES.DISTRIBUTE_ROOM) {
      console.log(payload);
      const action = addRoomID(payload['roomID'], payload['studentID']);
      dispatchChats(action);
    } else if (msgType === MESSAGE_TYPES.CONNECTION) {
      setUniqueID(payload['uniqueID']);
    } else if (msgType === MESSAGE_TYPES.QUEUE_LIST) {
      setQueue(payload['queueMembers']);
    }
  };

  useEffect(() => {
    getSocket().onmessage = socketHandler;
  }, []);

  const socketSend = (message: ISocketMessage | IGetMessage) => {
    getSocket().send(JSON.stringify(message));
  };
  return (
    <SocketContext.Provider
      value={{ uniqueID, chats, dispatchChats, queue, setQueue, socketSend }}
    >
      {children}
    </SocketContext.Provider>
  );
};
