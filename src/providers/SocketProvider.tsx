import React, { createContext, useEffect, useReducer, useState } from 'react';
import { CHAT_URL } from '../config';
import { IGetMessage, ISocketMessage } from '../interfaces';
import { addMessage, addRoomID, chatReducer } from '../reducers';
import { IAction, IChat, IStudent, ITextMessage } from '../interfaces';

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
  if (!socket) socket = new WebSocket(CHAT_URL);
  return socket;
};

export const SocketProvider = ({ children }: any) => {
  const [chats, dispatchChats] = useReducer(chatReducer, []);
  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<IStudent[]>([]);

  const socketHandler = (message): void => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);

    if (parsedMessage.type === 'textMessage') {
      const action = addMessage(
        {
          message: parsedMessage.payload['message'],
          author: parsedMessage.payload['author'],
          roomID: parsedMessage.payload['roomID'],
          uniqueID: parsedMessage.payload['uniqueID'],
          datetime: parsedMessage.payload['datetime'],
        },
        true,
      );
      dispatchChats(action);
    } else if (parsedMessage.type === 'distributeRoomMessage') {
      const action = addRoomID(
        parsedMessage.payload['roomID'],
        parsedMessage.payload['studentID'],
      );
      dispatchChats(action);
    } else if (parsedMessage.type === 'connectionMessage') {
      setUniqueID(parsedMessage.payload['uniqueID']);
    } else if (parsedMessage.type === 'setQueueMessage') {
      setQueue(parsedMessage.payload['queueMembers']);
    }
  };

  useEffect(() => {
    if (!getSocket()) {
      return;
    }
    getSocket().onmessage = socketHandler;
  });

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
