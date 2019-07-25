import { createAction, createReducer } from 'typesafe-actions';
import { IAction, IChat, IStudent, ITextMessage } from '../interfaces';

export const addRoomIDAction = createAction('ADD_ROOM_ID', cb => {
  return (roomID: string, studentID: string) => cb({ roomID, studentID });
});

export const addMessageAction = createAction('ADD_MESSAGE', cb => {
  return (message: ITextMessage, unread: boolean = false) =>
    cb({ message, unread });
});

export const readMessagesAction = createAction('READ_MESSAGES', cb => {
  return (roomID: string) => cb({ roomID });
});

export const addNewChatAction = createAction('ADD_NEW', cb => {
  return (student: IStudent) => cb({ student });
});

export const setChatFromLocalStorageAction = createAction('SET_ALL', cb => {
  return (chats: IChat[]) => cb({ chats });
});

export const leaveChatAction = createAction('LEAVE_CHAT', cb => {
  return (roomID: string) => cb({ roomID });
});

export const hasLeftChatAction = createAction('HAS_LEFT_CHAT', cb => {
  return (roomID: string, name: string) => cb({ roomID, name });
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

export const chatReducer = createReducer<IChat[], IAction>([])
  .handleAction(addRoomIDAction, handleAddRoomID)
  .handleAction(addMessageAction, handleAddMessage)
  .handleAction(readMessagesAction, handleReadMessages)
  .handleAction(addNewChatAction, handleAddNewChat)
  .handleAction(leaveChatAction, handleLeaveChat)
  .handleAction(hasLeftChatAction, handleHasLeftChat)
  .handleAction(setChatFromLocalStorageAction, handleSetChatFromLocalStorage);
