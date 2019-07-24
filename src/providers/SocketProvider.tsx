import React, { createContext, useEffect, useReducer, useState } from 'react';
import { CHAT_URL, MESSAGE_TYPES } from '../config';
import { IGetMessage, ISocketMessage } from '../interfaces';
import {
  addMessage, addNewChat,
  addRoomID,
  chatReducer, joinChatAction,
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

  name: '' as string,
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
  const [name, setName] = useState<string>('');

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
      setName(Math.random().toString(36).substring(7));
    } else if (msgType === MESSAGE_TYPES.QUEUE_LIST) {
      setQueue(payload['queueMembers']);
    } else if(msgType === MESSAGE_TYPES.JOIN_CHAT){
      const student:IStudent = payload['studentInfo'];
      const action = joinChatAction(student, payload['roomID'])
      dispatchChats(action);
    }
  };

  useEffect(() => {
    getSocket().onmessage = socketHandler;
  }, []);

  // This keeps state persistent while refreshing page (except for the socket)
  useEffect(() => {
    localStorage.setItem('queue', JSON.stringify(queue));
  }, [queue]);
  useEffect(() => {
    localStorage.setItem('uniqueID', uniqueID);
  }, [uniqueID]);
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  /*window.onload = () => {
    // Set state if stuff in localstorage
    const queueFromLocalStorage = localStorage.getItem('queue');
    const uniqueIDFromLocalStorage = localStorage.getItem('uniqueID');
    const chatsFromLocalStorage = localStorage.getItem('chats');

    if (queueFromLocalStorage) {
      setQueue(JSON.parse(queueFromLocalStorage));
    }
    if (uniqueIDFromLocalStorage) {
      setUniqueID(uniqueIDFromLocalStorage);
    }
    if (chatsFromLocalStorage) {
      dispatchChats(setChatFromLocalStorage(JSON.parse(chatsFromLocalStorage)));
    }
  };

  window.onclose = () => {
    localStorage.clear();
  };*/
  const socketSend = (message: ISocketMessage | IGetMessage) => {
    getSocket().send(JSON.stringify(message));
  };
  return (
    <SocketContext.Provider
      value={{ uniqueID, chats, dispatchChats, queue, setQueue, socketSend, name }}
    >
      {children}
    </SocketContext.Provider>
  );
};
