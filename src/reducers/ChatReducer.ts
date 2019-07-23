import { createAction, createReducer } from 'typesafe-actions';
import { IAction, IChat, IStudent, ITextMessage } from '../interfaces';

export const addRoomID = createAction('ADD_ROOM_ID', cb => {
  return (roomID: string, studentID: string) => cb({ roomID, studentID });
});

export const addMessage = createAction('ADD_MESSAGE', cb => {
  return (message: ITextMessage, unread: boolean = false) =>
    cb({ message, unread });
});

export const readMessages = createAction('READ_MESSAGES', cb => {
  return (roomID: string) => cb({ roomID });
});

export const addNewChat = createAction('ADD_NEW', cb => {
  return (student: IStudent) => cb({ student });
});

export const setChatFromLocalStorage = createAction('SET_ALL', cb => {
  return (chats: IChat[]) => cb({ chats });
});

export const joinChatAction = createAction('JOIN_CHAT', cb => {
  return (student: IStudent, roomID: string) => cb({student, roomID});
});

const joinChatHandler = (state: IChat[], action: IAction) => {
  const newChat: IChat = {
    student: action.payload.student,
    messages: [],
    roomID: action.payload.roomID,
    unread: 0,
  };
  return [...state, newChat];
};

export const chatReducer = createReducer<IChat[], IAction>([])
  .handleAction(addRoomID, (state: IChat[], action: IAction) => {
    const roomToSetID = state.find(
      chat =>
        chat.student.uniqueID.localeCompare(action.payload.studentID) === 0,
    );
    if (roomToSetID) {
      roomToSetID.roomID = action.payload.roomID
    };
    return [...state];
  })
  .handleAction(addMessage, (state: IChat[], action: IAction) => {
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
  })
  .handleAction(readMessages, (state: IChat[], action: IAction) => {
    const chat = state.find(chat => chat.roomID === action.payload.roomID);
    if (chat) chat.unread = 0;
    return [...state];
  })
  .handleAction(addNewChat, (state: IChat[], action: IAction) => {
    const newChat: IChat = {
      student: action.payload.student,
      messages: [],
      roomID: '',
      unread: 0,
    };
    return [...state, newChat];
  })
  .handleAction(setChatFromLocalStorage, (state: IChat[], action: IAction) => {
    return action.payload.chats;
  })
  .handleAction(joinChatAction, joinChatHandler);
