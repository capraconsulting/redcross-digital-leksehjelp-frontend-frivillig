import { ISocketFile, IFile } from '.';

export interface ITextMessage {
  author: string;
  roomID: string;
  uniqueID: string;
  message?: string;
  files?: IFile[];
  datetime?: Date;
  unread?: number;
}
