import { IGenerateRoomMessage, ITextMessage, IEnterQueueMessage } from '.';


export interface ISocketMessage {
  msgType: string;
  payload: ITextMessage | IGenerateRoomMessage | IEnterQueueMessage | {};
}
