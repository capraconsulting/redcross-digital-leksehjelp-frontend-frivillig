import { IGenerateRoomMessage, ITextMessage, IEnterQueueMessage } from '.';

export interface ISocketMessage {
  type: string;
  payload: ITextMessage | IGenerateRoomMessage | IEnterQueueMessage | string[];
}
