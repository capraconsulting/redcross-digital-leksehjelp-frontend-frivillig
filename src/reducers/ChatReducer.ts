import { createAction, createReducer } from 'typesafe-actions';
import { IAction, IChat, IStudent, ITextMessage } from '../interfaces';

export const addRoomID = createAction('ADD_ROOM_ID', cb => {
  return (roomID: string, studentID: string) => cb({ roomID, studentID });
});

export const addMessage = createAction('ADD_MESSAGE', cb => {
  return (
    roomID: string,
    message: ITextMessage | string,
    unread: boolean = false,
  ) => cb({ roomID, message, unread });
});

export const readMessages = createAction('READ_MESSAGES', cb => {
  return (roomID: string) => cb({ roomID });
});

export const addNewChat = createAction('ADD_NEW', cb => {
  return (student: IStudent) => cb({ student });
});

export const chatReducer = createReducer<IChat[], IAction>([])
  .handleAction(addRoomID, (state: IChat[], action: IAction) => {
    state.forEach(chat => console.log(chat.student.uniqueID));
    console.log(action.payload.studentID);
    const roomToSetID = state.find(
      chat => chat.student.uniqueID.localeCompare(action.payload.studentID) === 0,
    );
    if (roomToSetID) roomToSetID.roomID = action.payload.roomID;
    console.log(roomToSetID);
    console.log(state);
    return [...state];
  })
  .handleAction(addMessage, (state: IChat[], action: IAction) => {
    const room = state.find(chat => chat.roomID === action.payload.roomID);
    if (room) {
      if (action.payload.unread) {
        room.unread += 1;
      }
      room.messages.push(action.payload.message);
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
  });
