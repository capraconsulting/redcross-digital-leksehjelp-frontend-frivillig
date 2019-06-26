import IMessage from '../interfaces/IMessage';
import ISocketFile from '../interfaces/ISocketFile';

export const createEnterWaitingRoomMessage = (): IMessage => {
  return {
    author: 'student',
    roomID: '',
    uniqueID: '',
    message: '',
    datetime: new Date(0),
    enterWaitingRoom: true,
    createNewRoom: true
  };
};

export const createTextMessage = (message: string): IMessage => {
  return {
    author: 'student',
    roomID: '',
    uniqueID: '',
    message,
    datetime: new Date(),
    enterWaitingRoom: false,
    createNewRoom: false,
  };
};

export const createFileMessage = (file: ISocketFile): IMessage => {
  return {
    author: 'student',
    roomID: '',
    uniqueID: '',
    message: file,
    datetime: new Date(),
    enterWaitingRoom: false,
    createNewRoom: false,
  };
};
