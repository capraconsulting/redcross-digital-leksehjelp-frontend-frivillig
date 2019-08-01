import React, {
  createContext,
  useEffect,
  useReducer,
  useState,
  FunctionComponent,
} from 'react';
import { CHAT_URL, MESSAGE_TYPES } from '../config';
import { IGetMessage, ISocketMessage, ITextMessage } from '../interfaces';
import {
  addMessageAction,
  addRoomIDAction,
  chatReducer,
  hasLeftChatAction,
  joinChatAction,
  leaveChatAction,
  reconnectChatAction,
} from '../reducers';
import { IAction, IChat, IStudent } from '../interfaces';

import { toast } from 'react-toastify';
import { getVolunteer, ReconnectMessageBuilder } from '../services';
import { createPingMessage } from '../services';
import { IVolunteer } from '../interfaces/IVolunteer';

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

  name: '' as string,

  availableVolunteers: [] as string[],

  volunteerInfo: {
    id: '',
    bioText: '',
    email: '',
    name: '',
    imgUrl: '',
    } as IVolunteer
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
  const [talkyID, setTalkyID] = useState<string>('');
  const [volunteerInfo, setVolunteerInfo] = useState<IVolunteer>({
    id: '',
    bioText: '',
    email: '',
    name: '',
    imgUrl: '',
  });
  const {
    DISTRIBUTE_ROOM,
    CONNECTION,
    QUEUE_LIST,
    TEXT,
    LEAVE_CHAT,
    ERROR_LEAVING_CHAT,
    JOIN_CHAT,
    AVAILABLE_CHAT,
    RECONNECT,
  } = MESSAGE_TYPES;
  const [name, setName] = useState<string>('');
  const [availableVolunteers, setAvailableVolunteers] = useState<string[]>([]);

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
            imgUrl: payload['imgUrl'],
            files: payload['files'],
          },
          true,
        );
        dispatchChats(action);
        break;
      case DISTRIBUTE_ROOM:
        setTalkyID(payload['talkyID']);
        getVolunteer().then( (data: IVolunteer) => {
          action = addRoomIDAction(payload['roomID'], payload['studentID']);
          dispatchChats(action);
          console.log(data);
          setVolunteerInfo(data);
          }
        );

        break;
      case CONNECTION:
        setUniqueID(payload['uniqueID']);
        setInterval(() => socketSend(createPingMessage()), 300000);
        reconnectHandler(payload['uniqueID']);
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
      case JOIN_CHAT:
        const student: IStudent = payload['studentInfo'];
        const messages: ITextMessage[] = payload['chatHistory'];
        action = joinChatAction(student, messages, payload['roomID']);
        dispatchChats(action);
        break;
      case AVAILABLE_CHAT:
        setAvailableVolunteers(payload['queueMembers']);
        break;
    }
  };


  /*
  const socketSend = (message: ISocketMessage | IGetMessage): void => {
    getSocket().send(JSON.stringify(message));
  };
  */
  /*
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
  */
  /*
  const getRoomNumbersFromChat = (chats: IChat[]): string[] => {
    return chats.map(chat => chat.roomID);
  };
  */
  /*
  const reconnectHandler = (uniqueID: string): void => {
    const chatsFromSessionStorage = localStorage.getItem('chats');
    const oldUniqueID = sessionStorage.getItem('oldUniqueID');

    if (chatsFromSessionStorage && oldUniqueID) {
      /*
       * If not both chatsFromSessionStorage and oldUniqueID is present
       * then there is no point in reconnecting.
       */
  /*
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
  */

  useEffect(() => {
    getSocket().onmessage = socketHandler;
  }, []);

  useEffect(() => {
    if (talkyID) {
      const windowObjectReference = window.open(
        `https://talky.io/${talkyID}`,
        '_blank',
      );
      if (windowObjectReference) {
        windowObjectReference.focus();
      }
    }
  }, [talkyID]);

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
        name,
        availableVolunteers,
        volunteerInfo,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
