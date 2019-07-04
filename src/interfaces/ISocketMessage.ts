import { IGenerateRoomMessage, ITextMessage, IEnterQueueMessage } from '.';


export interface ISocketMessage {
  type: MessageEnum;
  payload: ITextMessage | IGenerateRoomMessage | IEnterQueueMessage | {};
}
