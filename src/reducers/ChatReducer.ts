import { createAction, createReducer } from 'typesafe-actions';
import { IAction, IChat, IStudent, ITextMessage } from '../interfaces';

export const addRoomIDAction = createAction('ADD_ROOM_ID', callback => {
  return (roomID: string, studentID: string) => callback({ roomID, studentID });
});

export const addMessageAction = createAction('ADD_MESSAGE', callback => {
  return (message: ITextMessage, unread: boolean = false) =>
    callback({ message, unread });
});

export const readMessagesAction = createAction('READ_MESSAGES', callback => {
  return (roomID: string) => callback({ roomID });
});

export const addNewChatAction = createAction('ADD_NEW', callback => {
  return (student: IStudent) => callback({ student });
});

export const setChatFromLocalStorageAction = createAction(
  'SET_ALL',
  callback => {
    return (chats: IChat[]) => callback({ chats });
  },
);

export const leaveChatAction = createAction('LEAVE_CHAT', callback => {
  return (roomID: string) => callback({ roomID });
});

export const reconnectChatAction = createAction('RECONNECT', cb => {
  return (chats: IChat[]) => cb({ chats });
});

export const hasLeftChatAction = createAction('HAS_LEFT_CHAT', cb => {
  return (roomID: string, name: string) => cb({ roomID, name });
});

export const joinChatAction = createAction('JOIN_CHAT', cb => {
  return (student: IStudent, messages: ITextMessage[], roomID: string) =>
    cb({ student, messages, roomID });
});

const handleAddRoomID = (state: IChat[], action: IAction) => {
  const roomToSetID = state.find(
    chat => chat.student.uniqueID.localeCompare(action.payload.studentID) === 0,
  );
  if (roomToSetID) {
    roomToSetID.roomID = action.payload.roomID;
  }
  return [...state];
};

const handleAddMessage = (state: IChat[], action: IAction) => {
  const room = state.find(
    chat => chat.roomID === action.payload.message.roomID,
  );
  if (room) {
    if (action.payload.unread) {
      room.unread += 1;
    }
    const message: ITextMessage = action.payload.message;
    room.messages.push(message);
  }
  return [...state];
};

const handleReadMessages = (state: IChat[], action: IAction) => {
  const chat = state.find(chat => chat.roomID === action.payload.roomID);
  if (chat) chat.unread = 0;
  return [...state];
};

const handleAddNewChat = (state: IChat[], action: IAction) => {
  const newChat: IChat = {
    student: action.payload.student,
    messages: [],
    roomID: '',
    unread: 0,
  };
  return [...state, newChat];
};

const handleLeaveChat = (state: IChat[], action: IAction) => {
  return state.filter(chat => chat.roomID !== action.payload.roomID);
};

const handleSetChatFromLocalStorage = (state: IChat[], action: IAction) => {
  return action.payload.chats;
};

const joinChatHandler = (state: IChat[], action: IAction) => {
  let chatHistory: ITextMessage[] = [];
  action.payload.messages.forEach((message: ITextMessage) => {
    chatHistory.push(message);
  });

  const newChat: IChat = {
    student: action.payload.student,
    messages: chatHistory,
    roomID: action.payload.roomID,
    unread: 0,
  };
  return [...state, newChat];
};

const handleHasLeftChat = (state: IChat[], action: IAction) => {
  const chatWhereAUserLeaves: IChat | undefined = state.find(
    chat => chat.roomID === action.payload.roomID,
  );
  if (chatWhereAUserLeaves) {
    chatWhereAUserLeaves.messages.push({
      author: action.payload.name,
      message: 'Har forlatt rommet',
      roomID: action.payload.roomID,
      uniqueID: 'NOTIFICATION',
    });
  }
  return [...state];
};

const handleReconnectChat = (state: IChat[], action: IAction) => {
  return action.payload.chats;
};

export const chatReducer = createReducer<IChat[], IAction>([])
  .handleAction(addRoomIDAction, handleAddRoomID)
  .handleAction(addMessageAction, handleAddMessage)
  .handleAction(readMessagesAction, handleReadMessages)
  .handleAction(addNewChatAction, handleAddNewChat)
  .handleAction(leaveChatAction, handleLeaveChat)
  .handleAction(hasLeftChatAction, handleHasLeftChat)
  .handleAction(reconnectChatAction, handleReconnectChat);
  .handleAction(joinChatAction, joinChatHandler)
  .handleAction(setChatFromLocalStorageAction, handleSetChatFromLocalStorage);
