import { IStudent } from './IStudent';
import { ITextMessage } from './ITextMessage';

export interface IJoin {
  uniqueID: string;
  roomID: string;
  studentInfo: IStudent;
  chatHistory: ITextMessage[];
}
