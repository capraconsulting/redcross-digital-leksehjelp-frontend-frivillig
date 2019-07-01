import React, { useEffect, useState } from 'react';
import ChatBodyComponent from '../components/Chat/ChatBodyComponent';
import ChatHeaderComponent from '../components/Chat/ChatHeaderComponent';
import ChatQueueComponent from '../components/Chat/ChatQueueComponent';
import ChatInputComponent from '../components/Chat/ChatInputComponent';
import {
  IGetMessage,
  ISocketMessage,
  IStudentInQueue,
  ITextMessage,
} from '../interfaces';

import {
  createGenerateRoomMessage,
  createGetQueueMessage,
} from '../services/message-service';
import { getSocket } from '../utils';

const testQueue: IStudentInQueue[] = [
  {
    nickname: 'Bjørn Olav',
    subject: 'Matematikk',
    grade: '10. klasse',
    uniqueID: 'fbpfusdbf90åqwdqwhb',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
  {
    nickname: 'Geir Torvald',
    subject: 'Engelsk',
    grade: '10. klasse',
    uniqueID: 'ch98fh78dgokndashjbd',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
  {
    nickname: 'Hanna Grostad',
    subject: 'Norsk',
    grade: '10. klasse',
    uniqueID: 'dnshaudcasopdja89',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
  {
    nickname: 'Gro Hamstad',
    subject: 'Engelsk',
    grade: '10. klasse',
    uniqueID: 'dasdfoiushfwef9qw0',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
  {
    nickname: 'Arya Stark',
    subject: 'Sverddansing',
    grade: '10. klasse',
    uniqueID: 'dnh8os7ad9yuqwdjiosh',
    introText:
      'Hei. \nKan dere hjelpe meg å forklare begrepene egosentrisk og etnosentrisk? Hvordan kan man bruke disse til å analysere årsaker til konflikter mellom individer og mellom grupper?',
  },
];

const ChatContainer = () => {
  const [socket, setSocket] = useState(null as any);
  const [messages, setMessages] = useState<ITextMessage[]>([]);
  const [roomID, setRoomID] = useState<string>('');
  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<IStudentInQueue[]>(testQueue);

  useEffect(() => {
    setSocket(getSocket());
  }, []);

  const generateTextMessageFromPayload = (
    message: ISocketMessage,
  ): ITextMessage => {
    return message.payload as ITextMessage;
  };

  const socketHandler = (message): void => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);

    if (parsedMessage.type === 'textMessage') {
      setMessages(messages => [
        ...messages,
        generateTextMessageFromPayload(parsedMessage),
      ]);
    } else if (parsedMessage.type === 'distributeRoomMessage') {
      setRoomID(parsedMessage.payload['roomID']);
    } else if (parsedMessage.type === 'connectionMessage') {
      setUniqueID(parsedMessage.payload['uniqueID']);
    } else if (parsedMessage.type === 'setQueueMessage') {
      setQueue(parsedMessage.payload['queueMembers']);
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = socketHandler;
  }, [socket]);

  useEffect(() => {
    // Auto scroll down in chat
    const display = document.querySelector('.display');
    if (display) {
      display.scrollTo(0, display.scrollHeight);
    }
  }, [messages]);

  const onSendTextAndFileMessage = (message: ISocketMessage): void => {
    setMessages(messages => [
      ...messages,
      generateTextMessageFromPayload(message),
    ]);
    socket.send(JSON.stringify(message));
  };

  const onSendGetQueueMessage = (): void => {
    const getMessage: IGetMessage = createGetQueueMessage();
    socket.send(JSON.stringify(getMessage));
  };

  const onSendGenerateRoomMessage = (studentID: string): void => {
    const socketMessage: ISocketMessage = createGenerateRoomMessage(
      uniqueID,
      studentID,
    );
    socket.send(JSON.stringify(socketMessage));
  };

  return (
    <div className={'chat'}>
      <button onClick={() => onSendGetQueueMessage()}>Update queue</button>
      {roomID && (
        <ChatHeaderComponent
          connectedWith="Caroline Sandsbråten"
          course="Engelsk"
        />
      )}
      {!roomID && (
        <ChatQueueComponent
          createRoomWith={onSendGenerateRoomMessage}
          queueMembers={queue}
        />
      )}
      {roomID && <ChatBodyComponent messages={messages} />}
      {roomID && (
        <ChatInputComponent
          uniqueID={uniqueID}
          roomID={roomID}
          onSend={onSendTextAndFileMessage}
        />
      )}
    </div>
  );
};

export default ChatContainer;
