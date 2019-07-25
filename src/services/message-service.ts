import {
  IGenerateRoomMessage,
  IEnterQueueMessage,
  ISocketMessage,
  ITextMessage,
  ISocketFile, IStudent,
} from '../interfaces';
import { MESSAGE_TYPES } from '../config';
import { IJoin } from '../interfaces/IJoin';

const { QUEUE_LIST, LEAVE_CHAT, GENERATE_ROOM, TEXT } = MESSAGE_TYPES;

const createMessage = (
  payload: ITextMessage | IEnterQueueMessage | IGenerateRoomMessage | IJoin | {},
  type: string,
): ISocketMessage => {
  return {
    payload,
    msgType: type,
  };
};

export const createGetQueueMessage = (): ISocketMessage => {
  return createMessage({}, QUEUE_LIST);
};

export const createLeaveChatMessage = (
  roomID: string,
  uniqueID: string,
): ISocketMessage => {
  return createMessage({ roomID, uniqueID }, LEAVE_CHAT);
};

export const createAvailableChatMessage = (): ISocketMessage => {
  return createMessage({}, MESSAGE_TYPES.AVAILABLE_CHAT);
}
export const createJoinMessage = (
  uniqueID: string,
  roomID: string,
  studentInfo: IStudent,
): ISocketMessage => {
  const generateJoinMessage: IJoin = {
    uniqueID,
    roomID,
    studentInfo
  };
  return createMessage(generateJoinMessage, MESSAGE_TYPES.JOIN_CHAT);
}

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
  return createMessage(generateRoomMessage, GENERATE_ROOM);
};

export const createTextMessage = (
  message: string | ISocketFile,
  uniqueID: string,
  roomID: string,
  author: string,
): {
  textMessage: ITextMessage;
  socketMessage: ISocketMessage;
} => {
  const textMessage: ITextMessage = {
    author,
    uniqueID,
    roomID,
    message,
  };
  /*
   * Needs to return the entire textMessage to set state when sending messages.
   */
  return {
    textMessage,
    socketMessage: createMessage(textMessage, TEXT),
  };
};
