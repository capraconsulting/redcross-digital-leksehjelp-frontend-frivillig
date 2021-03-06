import React, {
  createContext,
  useEffect,
  useReducer,
  useState,
  FunctionComponent,
} from 'react';
import { CHAT_URL, MESSAGE_TYPES } from '../config';
import {
  IGetMessage,
  ISocketMessage,
  ITalky,
  ITextMessage,
} from '../interfaces';
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
import {
  getVolunteer,
  createReconnectMessage,
  createVolunteerMessage,
  getTimeStringNow,
  createGetQueueMessage,
} from '../services';
import { createPingMessage } from '../services';
import { IVolunteer } from '../interfaces';

// Toast notification config (for entire App)
toast.configure({
  autoClose: 2000,
  draggable: false,
  position: 'top-center',
  closeButton: false,
  closeOnClick: true,
});

// Websocket
let socket;
const getSocket = (): WebSocket => {
  if (!socket) {
    if (process.env.NODE_ENV === 'production') {
      socket = new WebSocket(process.env.CHAT_URL || '');
    } else {
      socket = new WebSocket(CHAT_URL);
    }
  }
  return socket;
};

interface ISocketState {
  uniqueID: string;
  chats: IChat[];
  queue: IStudent[];
  activeChatIndex: number;
  talky: ITalky | null;
  availableVolunteers: IVolunteer[];
  volunteerInfo: IVolunteer;

  dispatchChats(_: IAction): void;
  setQueue(_: IStudent[]): void;
  socketSend(_: ISocketMessage | IGetMessage): void;
  setActiveChatIndex(_: number): void;
  setVolunteerInfo(_: IVolunteer): void;
  setAvailableVolunteers(_: IVolunteer[]): void;
}

export const SocketContext = createContext<ISocketState>({
  // Values available with context
  uniqueID: '',
  chats: [{}] as IChat[],
  queue: [],
  activeChatIndex: 0,
  talky: null,
  availableVolunteers: [],
  volunteerInfo: {
    id: '',
    name: '',
    bioText: '',
    email: '',
    imgUrl: '',
    chatID: '',
  },

  // Functions available with context
  dispatchChats(action: IAction): void {},
  setQueue(state: IStudent[]): void {},
  socketSend(message: ISocketMessage | IGetMessage): void {},
  setActiveChatIndex(index: number): void {},
  setVolunteerInfo(data: IVolunteer): void {},
  setAvailableVolunteers(vols: IVolunteer[]): void {},
});

export const SocketProvider: FunctionComponent = ({ children }) => {
  const [chats, dispatchChats] = useReducer(chatReducer, []);
  const [activeChatIndex, setActiveChatIndex] = useState<number>(0);
  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<IStudent[]>([]);
  const [talky, setTalky] = useState<ITalky | null>(null);
  const [availableVolunteers, setAvailableVolunteers] = useState<IVolunteer[]>(
    [],
  );
  const [volunteerInfo, setVolunteerInfo] = useState<IVolunteer>({
    id: '',
    bioText: '',
    email: '',
    name: '',
    imgUrl: '',
    chatID: '',
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

  const waitForSocketReady = callback => {
    if (socket.readyState === 1) {
      callback();
    } else {
      setTimeout(() => waitForSocketReady(callback), 100);
    }
  };

  const socketSend = (message: ISocketMessage | IGetMessage): void => {
    const s = getSocket();
    waitForSocketReady(() => {
      s.send(JSON.stringify(message));
    });
  };

  const reconnectSuccessHandler = (roomIDs: string[]): void => {
    const chatsFromSessionStorage = sessionStorage.getItem('chats');
    if (chatsFromSessionStorage) {
      const parsedChatsFromSessionStorage: IChat[] = JSON.parse(
        chatsFromSessionStorage,
      );

      const talkyFromSessionStorage = sessionStorage.getItem('talky');
      let parsedTalkyFromSessionStorage: ITalky;
      if (talkyFromSessionStorage) {
        parsedTalkyFromSessionStorage = JSON.parse(talkyFromSessionStorage);
      }

      const successFullReconnectedChats = parsedChatsFromSessionStorage.filter(
        chat => {
          if (roomIDs.includes(chat.roomID)) {
            if (
              parsedTalkyFromSessionStorage &&
              roomIDs.includes(parsedTalkyFromSessionStorage.roomID)
            ) {
              setTalky(parsedTalkyFromSessionStorage);
            }
            return chat;
          }
        },
      );
      if (successFullReconnectedChats.length > 0) {
        dispatchChats(reconnectChatAction(successFullReconnectedChats));
      } else {
        sessionStorage.removeItem('chats');
      }
    }
  };

  const reconnectHandler = (uniqueID: string): void => {
    const oldUniqueID = sessionStorage.getItem('oldUniqueID');

    if (oldUniqueID) {
      setUniqueID(oldUniqueID);
      const message = createReconnectMessage(oldUniqueID);
      socketSend(message);
    } else {
      setUniqueID(uniqueID);
    }
    socketSend(createGetQueueMessage());
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
            datetime: getTimeStringNow(),
            imgUrl: payload['imgUrl'],
            files: payload['files'],
          },
          true,
        );
        dispatchChats(action);
        break;
      case DISTRIBUTE_ROOM:
        action = addRoomIDAction(payload['roomID'], payload['studentID']);
        dispatchChats(action);
        if (!talky && payload['talkyID']) {
          setTalky({
            talkyID: payload['talkyID'],
            roomID: payload['roomID'],
            opened: false,
          });
        }
        getVolunteer().then(data => {
          setVolunteerInfo(data);
          socketSend(createVolunteerMessage(data));
        });
        break;
      case CONNECTION:
        setUniqueID(payload['uniqueID']);
        setInterval(() => socketSend(createPingMessage()), 300000);
        getVolunteer().then(data => {
          setVolunteerInfo(data);
          socketSend(createVolunteerMessage(data));
        });
        reconnectHandler(payload['uniqueID']);
        break;
      case QUEUE_LIST:
        setQueue(payload['queueMembers']);
        break;
      case LEAVE_CHAT:
        if (payload['uniqueID'] === uniqueID) {
          action = leaveChatAction(payload['roomID']);
          toast.success('Du forlot rommet');
          if (talky && talky.roomID === payload['roomID']) {
            setTalky(null);
          }
          setActiveChatIndex(0);
        } else {
          action = hasLeftChatAction(
            payload['roomID'],
            payload['name'],
            payload['volunteerCount'],
            payload['message'],
          );
        }
        dispatchChats(action);
        break;
      case ERROR_LEAVING_CHAT:
        toast.error('Det skjedde en feil. Du forlot ikke rommet.');
        break;
      case RECONNECT:
        getVolunteer().then(data => {
          setVolunteerInfo(data);
          socketSend(createVolunteerMessage(data));
        });
        reconnectSuccessHandler(payload['roomIDs']);
        break;
      case JOIN_CHAT:
        action = joinChatAction(
          payload['studentInfo'],
          payload['chatHistory'],
          payload['roomID'],
          payload['volunteerCount'],
        );
        dispatchChats(action);
        break;
      case AVAILABLE_CHAT:
        setAvailableVolunteers(payload['queueMembers']);
        break;
    }
  };

  const socketCloseHandler = () => {
    socket = null;
    getSocket().onmessage = socketHandler;
  };

  useEffect(() => {
    let socket = getSocket();

    socket.onmessage = socketHandler;
    socket.onclose = socketCloseHandler;
  }, []);

  useEffect(() => {
    if (talky && !talky.opened) {
      const newTalky: ITalky = {
        talkyID: talky.talkyID,
        roomID: talky.roomID,
        opened: true,
      };
      setTalky(newTalky);
      sessionStorage.setItem('talky', JSON.stringify(newTalky));
      const windowObjectReference = window.open(
        `https://talky.io/${talky.talkyID}`,
        '_blank',
      );
      if (windowObjectReference) {
        windowObjectReference.focus();
      }
    }
  }, [talky]);

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
        talky,
        availableVolunteers,
        volunteerInfo,
        setVolunteerInfo,
        setAvailableVolunteers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
