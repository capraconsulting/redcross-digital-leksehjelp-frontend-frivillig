import { IFile } from './IFile';

export interface ITextMessage {
  author: string;
  roomID: string;
  uniqueID: string;
  message?: string;
  imgUrl: string;
  files?: IFile[];
  datetime?: Date;
  unread?: number;
}
