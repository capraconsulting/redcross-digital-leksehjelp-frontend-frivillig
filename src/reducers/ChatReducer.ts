import { createAction, createReducer } from 'typesafe-actions';
import { IAction, IChat, ITextMessage } from '../interfaces';

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

export const chatReducer = createReducer<IChat[], IAction>([])
  .handleAction(addRoomID, (state: IChat[], action: IAction) => {
    const roomToSetID = state.find(
      chat => chat.student.uniqueID === action.payload.studentID,
    );
    if (roomToSetID) roomToSetID.roomID = action.payload.roomID;
    return [...state];
  })
  .handleAction(addMessage, (state: IChat[], action: IAction) => {
    const room = state.find(chat => chat.roomID === action.payload.roomID);
    if (room) {
      console.log(action.payload);
      if (action.payload.unread) {
        console.log('hgei');
        room.unread += 1;
      }
      room.messages.push(action.payload.message);
    }
    return [...state];
  })
  .handleAction(readMessages, (state: IChat[], action: IAction) => {
    const chat = state.find(
      chat => chat.roomID === action.payload.roomID,
    );
    if (chat) chat.unread = 0;
    return [...state];
  });
