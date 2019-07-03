import React, { createContext, useEffect, useReducer, useState } from 'react';
import { CHAT_URL } from '../config';
import { IGetMessage, ISocketMessage } from '../interfaces';
import { addMessage, addRoomID, chatReducer } from '../reducers';
import { IAction, IChat, IStudent, ITextMessage } from '../interfaces';
import { getSocket } from '../utils';

const testQueue: IStudent[] = [
  {
    nickname: 'Bjørn Olav',
    course: 'Matematikk',
    grade: '10. klasse',
    uniqueID: 'fbpfusdbf90åqwdqwhb',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
  {
    nickname: 'Geir Torvald',
    course: 'Engelsk',
    grade: '10. klasse',
    uniqueID: 'ch98fh78dgokndashjbd',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
  {
    nickname: 'Hanna Grostad',
    course: 'Norsk',
    grade: '10. klasse',
    uniqueID: 'dnshaudcasopdja89',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
  {
    nickname: 'Gro Hamstad',
    course: 'Engelsk',
    grade: '10. klasse',
    uniqueID: 'dasdfoiushfwef9qw0',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
  {
    nickname: 'Arya Stark',
    course: 'Sverddansing',
    grade: '10. klasse',
    uniqueID: 'dnh8os7ad9yuqwdjiosh',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
];

const testMessageGenerator = (): ITextMessage[] => {
  const textMessages: ITextMessage[] = [];
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      textMessages.push({
        author: 'frivillig',
        roomID: 'dasnodas8dasgd87as',
        uniqueID: 'dashdasudyasd222',
        message: 'Hei bby kom og si hei',
        datetime: new Date(),
      });
    } else {
      textMessages.push({
        author: 'student',
        roomID: 'dasnodas8dasgd87as',
        uniqueID: 'dashddsadasudyasd222',
        message: 'Hei bby kom og si hei',
        datetime: new Date(),
      });
    }
  }
  return textMessages;
};

const initialChats: IChat[] = [
  {
    student: testQueue[0],
    messages: testMessageGenerator(),
    roomID: 'one',
    unread: 0,
  },
  {
    student: testQueue[1],
    messages: testMessageGenerator(),
    roomID: 'two',
    unread: 0,
  },
  {
    student: testQueue[2],
    messages: testMessageGenerator(),
    roomID: 'three',
    unread: 0,
  },
  {
    student: testQueue[3],
    messages: testMessageGenerator(),
    roomID: 'four',
    unread: 0,
  },
  {
    student: testQueue[4],
    messages: testMessageGenerator(),
    roomID: 'five',
    unread: 0,
  },
];

export const SocketContext = createContext({
  uniqueID: '' as string,

  chats: [] as IChat[],
  dispatchChats(action: IAction) {},

  queue: [] as IStudent[],
  setQueue(state: IStudent[]) {},

  socketSend(message: ISocketMessage | IGetMessage): void {}
});

export const SocketProvider = ({ children }) => {
  const [chats, dispatchChats] = useReducer(chatReducer, initialChats);
  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<IStudent[]>(testQueue);
  const [socket, setSocket] = useState();

  const socketHandler = (message): void => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);

    if (parsedMessage.type === 'textMessage') {
      const action = addMessage(
        parsedMessage.payload['roomID'],
        parsedMessage.payload['message'],
        true,
      );
      dispatchChats(action);
    } else if (parsedMessage.type === 'distributeRoomMessage') {
      const action = addRoomID(
        parsedMessage.payload['roomID'],
        parsedMessage.payload['studentID'],
      );
      dispatchChats(action);
    } else if (parsedMessage.type === 'connectionMessage') {
      setUniqueID(parsedMessage.payload['uniqueID']);
    } else if (parsedMessage.type === 'setQueueMessage') {
      setQueue(parsedMessage.payload['queueMembers']);
    }
  };



  useEffect(() => {
    if (!getSocket()) {
      return;
    }
    getSocket().onmessage = socketHandler;
  });


  const socketSend = (message: ISocketMessage | IGetMessage) => {
    getSocket().send(JSON.stringify(message));
  };
  return (
    <SocketContext.Provider value={{ uniqueID, chats, dispatchChats, queue, setQueue, socketSend}}>
      {children}
    </SocketContext.Provider>
  );
};
