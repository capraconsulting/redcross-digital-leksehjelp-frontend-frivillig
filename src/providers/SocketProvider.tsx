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
import { ReconnectMessageBuilder } from '../services';

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
    RECONNECT,
  } = MESSAGE_TYPES;

  const socketSend = (message: ISocketMessage | IGetMessage): void => {
    getSocket().send(JSON.stringify(message));
  };

  const reconnectSuccessHandler = (roomIDs: string[]): void => {
    const chatsFromSessionStorage = localStorage.getItem('chats');
    if (chatsFromSessionStorage) {
      const parsedChatsFromSessionStorage: IChat[] = JSON.parse(
        chatsFromSessionStorage,
      );

      const successFullReconnectedChats = parsedChatsFromSessionStorage.filter(
        chat => {
          if (roomIDs.includes(chat.roomID)) {
            return chat;
          }
        },
      );
      dispatchChats(reconnectChatAction(successFullReconnectedChats));
    }
  };

  const getRoomNumbersFromChat = (chats: IChat[]): string[] => {
    return chats.map(chat => chat.roomID);
  };

  const reconnectHandler = (uniqueID: string): void => {
    const chatsFromSessionStorage = localStorage.getItem('chats');
    const oldUniqueID = sessionStorage.getItem('oldUniqueID');

    if (chatsFromSessionStorage && oldUniqueID) {
      /*
       * If not both chatsFromSessionStorage and oldUniqueID is present
       * then there is no point in reconnecting.
       */
      const parsedChatsFromSessionStorage: IChat[] = JSON.parse(
        chatsFromSessionStorage,
      );
      const msg = new ReconnectMessageBuilder(uniqueID)
        .withRoomIDs(getRoomNumbersFromChat(parsedChatsFromSessionStorage))
        .withOldUniqueID(oldUniqueID)
        .build();
      socketSend(msg.createMessage);
    }
  };

  const socketHandler = (message): void => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);
    const { payload, msgType } = parsedMessage;
    let action;

    switch (msgType) {
      case TEXT:
        action = addMessageAction(
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
        break;
      case DISTRIBUTE_ROOM:
        action = addRoomIDAction(payload['roomID'], payload['studentID']);
        dispatchChats(action);
        break;
      case CONNECTION:
        setUniqueID(payload['uniqueID']);
        //reconnectHandler(payload['uniqueID']);
        break;
      case QUEUE_LIST:
        setQueue(payload['queueMembers']);
        break;
      case LEAVE_CHAT:
        if (payload['uniqueID'] === uniqueID) {
          action = leaveChatAction(payload['roomID']);
          toast.success('Du forlot rommet');
        } else {
          action = hasLeftChatAction(payload['roomID'], payload['name']);
        }
        setActiveChatIndex(0);
        dispatchChats(action);
        break;
      case ERROR_LEAVING_CHAT:
        toast.error('Det skjedde en feil. Du forlot ikke rommet.');
        break;
      case RECONNECT:
        //reconnectSuccessHandler(payload['roomIDs']);
        break;
    }
  };

  useEffect(() => {
    getSocket().onmessage = socketHandler;
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
