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
  const msg: IGenerateRoomMessage = {
    uniqueID,
    studentID,
  };
  return createMessage(msg, 'generateRoomMessage');
};

export const createTextMessage = (
  message: string | ISocketFile,
  uniqueID: string,
  roomID: string,
): ISocketMessage => {
  const msg: ITextMessage = {
    author: 'student',
    uniqueID,
    roomID,
    message,
    datetime: new Date(),
  };
  return createMessage(msg, 'textMessage');
};
