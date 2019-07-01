import {
  IGenerateRoomMessage,
  IEnterQueueMessage,
  ISocketMessage,
  ITextMessage,
  IGetMessage,
  ISocketFile,
} from '../interfaces';

const createMessage = (
  payload: ITextMessage | IEnterQueueMessage | IGenerateRoomMessage,
  type: string,
): ISocketMessage => {
  return {
    type,
    payload,
  };
};

export const createGetQueueMessage = (): IGetMessage => {
  return {
    type: 'getQueueMessage',
  };
};

export const createGenerateRoomMessage = (
  uniqueID: string,
  studentID: string,
): ISocketMessage => {
  const generateRoomMessage: IGenerateRoomMessage = {
    uniqueID,
    studentID,
  };
  return createMessage(generateRoomMessage, 'generateRoomMessage');
};

export const createTextMessage = (
  message: string | ISocketFile,
  uniqueID: string,
  roomID: string,
): ISocketMessage => {
  const textMessage: ITextMessage = {
    author: 'student',
    uniqueID,
    roomID,
    message,
    datetime: new Date(),
  };
  return createMessage(textMessage, 'textMessage');
};
