import ISocketFile from '../interfaces/ISocketFile';

import {
  IGenerateRoomMessage,
  IEnterQueueMessage,
  ISocketMessage,
  ITextMessage, IGetMessage,
} from '../interfaces/IMessage';

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
