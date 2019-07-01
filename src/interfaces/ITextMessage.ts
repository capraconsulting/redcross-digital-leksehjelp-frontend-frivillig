import { ISocketFile } from '.';

export interface ITextMessage {
  author: string;
  roomID: string;
  uniqueID: string;
  message: string | ISocketFile;
  datetime: Date;
}
