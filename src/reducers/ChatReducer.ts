import { createAction, createReducer } from 'typesafe-actions';
import { IAction, IChat, IStudent, ITextMessage, IFile } from '../interfaces';

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

export const reconnectChatAction = createAction('RECONNECT', callback => {
  return (chats: IChat[]) => callback({ chats });
});

export const hasLeftChatAction = createAction('HAS_LEFT_CHAT', callback => {
  return (
    roomID: string,
    name: string,
    volunteerCount: number,
    message?: string,
  ) => callback({ roomID, name, message, volunteerCount });
});

export const joinChatAction = createAction('JOIN_CHAT', callback => {
  return (
    student: IStudent,
    messages: ITextMessage[],
    roomID: string,
    volunteerCount: number,
  ) => callback({ student, messages, roomID, volunteerCount });
});

const handleAddRoomID = (state: IChat[], action: IAction) =>
  state.map(chat =>
    chat.student.uniqueID === action.payload.studentID
      ? {
          ...chat,
          roomID: action.payload.roomID,
        }
      : chat,
  );

const handleAddMessage = (state: IChat[], action: IAction) =>
  state.map(chat =>
    chat.roomID === action.payload.message.roomID
      ? {
          ...chat,
          unread: action.payload.unread ? chat.unread + 1 : chat.unread,
          messages: [...chat.messages, action.payload.message],
        }
      : chat,
  );

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
    volunteerCount: 1,
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
  const { roomID, student, messages, volunteerCount } = action.payload;
  messages.forEach((message: ITextMessage) => {
    chatHistory.push(message);
  });
  const newChat: IChat = {
    student: student,
    messages: chatHistory,
    roomID: roomID,
    unread: 0,
    volunteerCount,
  };

  return [...state, newChat];
};

const handleHasLeftChat = (state: IChat[], action: IAction) => {
  const { name, roomID, imgUrl, message, volunteerCount } = action.payload;
  console.log(message, name);
  return state.map(chat =>
    chat.roomID === roomID
      ? {
          ...chat,
          volunteerCount,
          messages: [
            ...chat.messages,
            {
              author: name,
              message: message || `${name || 'Frivillig'} har forlatt rommet`,
              roomID: roomID,
              uniqueID: 'NOTIFICATION',
              imgUrl: imgUrl,
              files: [] as IFile[],
            },
          ],
        }
      : chat,
  );
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
  .handleAction(reconnectChatAction, handleReconnectChat)
  .handleAction(joinChatAction, joinChatHandler)
  .handleAction(setChatFromLocalStorageAction, handleSetChatFromLocalStorage)
  .handleAction(reconnectChatAction, handleReconnectChat);
