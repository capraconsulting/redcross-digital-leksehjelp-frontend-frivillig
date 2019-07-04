import {
  IGenerateRoomMessage,
  IEnterQueueMessage,
  ISocketMessage,
  ITextMessage,
  IGetMessage,
  ISocketFile,
} from '../interfaces';
import { useContext } from 'react';
import { SocketContext } from '../providers';

const { socketSend } = useContext(SocketContext);

const createMessage = (
  payload: ITextMessage | IEnterQueueMessage | IGenerateRoomMessage | {},
  type: MessageEnum,
): ISocketMessage => {
  return {
    payload,
    type,
  };
};

export const sendGetQueueMessage = (): void => {
  socketSend(createMessage({}, MessageEnum.QUEUE_LIST));
};

export const sendGenerateRoomMessage = (
  uniqueID: string,
  studentID: string,
  nickname: string,
  grade: string,
  introText: string,
  course: string,
): void => {
  const generateRoomMessage: IGenerateRoomMessage = {
    uniqueID,
    studentID,
    nickname,
    grade,
    introText,
    course,
  };
  socketSend(createMessage(generateRoomMessage, MessageEnum.GENERATE_ROOM));
};

export const sendTextMessage = (
  message: string | ISocketFile,
  uniqueID: string,
  roomID: string,
): ITextMessage => {
  const textMessage: ITextMessage = {
    author: 'frivillig',
    uniqueID,
    roomID,
    message,
    datetime: new Date().toTimeString(),
  };
  socketSend(createMessage(textMessage, MessageEnum.TEXT));
  /*
  * Needs to return the entire textMessage to set state when sending messages.
  */
  return textMessage;
};
