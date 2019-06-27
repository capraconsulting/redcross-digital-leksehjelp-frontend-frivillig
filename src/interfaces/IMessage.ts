import ISocketFile from './ISocketFile';

export interface ITextMessage {
  author: string;
  roomID: string;
  uniqueID: string;
  message: string | ISocketFile;
  datetime: Date;
}

export interface IEnterQueueMessage {
  uniqueID: string;
  datetime: Date;
}

export interface IGenerateRoomMessage {
  uniqueID: string;
  studentID: string;
}

export interface ISocketMessage {
  type: string;
  payload: ITextMessage | IGenerateRoomMessage | IEnterQueueMessage | string[];
}

export interface IGetMessage {
  type: string;
}
