import {
  IGenerateRoomMessage,
  IEnterQueueMessage,
  ISocketMessage,
  ITextMessage,
  ISocketFile,
} from '../interfaces';
import { MESSAGE_TYPES } from '../config';

const createMessage = (
  payload: ITextMessage | IEnterQueueMessage | IGenerateRoomMessage | {},
  type: string,
): ISocketMessage => {
  return {
    payload,
    msgType: type,
  };
};

export const createGetQueueMessage = (): ISocketMessage => {
  return createMessage({}, MESSAGE_TYPES.QUEUE_LIST);
};

export const createGenerateRoomMessage = (
  uniqueID: string,
  studentID: string,
  nickname: string,
  grade: string,
  introText: string,
  course: string,
): ISocketMessage => {
  const generateRoomMessage: IGenerateRoomMessage = {
    uniqueID,
    studentID,
    nickname,
    grade,
    introText,
    course,
  };
  return createMessage(generateRoomMessage, MESSAGE_TYPES.GENERATE_ROOM);
};

export const createTextMessage = (
  message: string | ISocketFile,
  uniqueID: string,
  roomID: string,
): {
  textMessage: ITextMessage;
  socketMessage: ISocketMessage;
} => {
  const textMessage: ITextMessage = {
    author: 'frivillig',
    uniqueID,
    roomID,
    message,
    datetime: new Date().toTimeString(),
  };
  /*
   * Needs to return the entire textMessage to set state when sending messages.
   */
  return {
    textMessage,
    socketMessage: createMessage(textMessage, MESSAGE_TYPES.TEXT),
  };
};
