import { IStudent, ITextMessage } from '.';

export interface IChat {
  student: IStudent;
  messages: ITextMessage[];
  roomID: string;
  unread: number;
  volunteerCount: number;
}
