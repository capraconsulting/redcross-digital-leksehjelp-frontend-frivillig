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

  availableVolunteers: [] as string[],
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
  const { DISTRIBUTE_ROOM, CONNECTION, QUEUE_LIST, TEXT } = MESSAGE_TYPES;
  const [name, setName] = useState<string>('');
  const [availableVolunteers, setAvailableVolunteers] = useState<string[]>([]);

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
      setName(Math.random().toString(36).substring(7));
    } else if (msgType === MESSAGE_TYPES.QUEUE_LIST) {
      setQueue(payload['queueMembers']);
    } else if(msgType === MESSAGE_TYPES.JOIN_CHAT){
      const student:IStudent = payload['studentInfo'];
      const action = joinChatAction(student, payload['roomID'])
      dispatchChats(action);
    } else if(msgType === MESSAGE_TYPES.AVAILABLE_CHAT){
      setAvailableVolunteers(payload['queueMembers']);
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
      value={{ uniqueID, chats, dispatchChats, queue, setQueue, socketSend, name, availableVolunteers}}
    >
      {children}
    </SocketContext.Provider>
  );
};
