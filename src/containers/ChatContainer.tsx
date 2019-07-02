import React, { useEffect, useReducer, useState } from 'react';
import ChatBodyComponent from '../components/Chat/ChatBodyComponent';
import ChatHeaderComponent from '../components/Chat/ChatHeaderComponent';
import ChatInputComponent from '../components/Chat/ChatInputComponent';
import {
  IGetMessage,
  ISocketMessage,
  IStudent,
  ITextMessage,
  IChat,
} from '../interfaces';

import {
  createGenerateRoomMessage,
  createGetQueueMessage,
} from '../services/message-service';
import { getSocket, socketSend } from '../utils';
import ActiveChatsComponent from '../components/Chat/ActiveChatsComponent';
import { addMessage, addRoomID, chatReducer, readMessages } from '../reducers';

const testQueue: IStudent[] = [
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

// main component
const ChatContainer = () => {
  const [availableChats, dispatchAvailableChats] = useReducer(
    chatReducer,
    initialChats,
  );
  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<IStudent[]>(testQueue);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const generateTextMessageFromPayload = (
    message: ISocketMessage,
  ): ITextMessage => {
    return message.payload as ITextMessage;
  };

  const socketHandler = (message): void => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);

    if (parsedMessage.type === 'textMessage') {
      const action = addMessage(
        parsedMessage.payload['roomID'],
        parsedMessage.payload['message'],
        true,
      );
      dispatchAvailableChats(action);
    } else if (parsedMessage.type === 'distributeRoomMessage') {
      const action = addRoomID(
        parsedMessage.payload['roomID'],
        parsedMessage.payload['studentID'],
      );
      dispatchAvailableChats(action);
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

  useEffect(() => {
    // Auto scroll down in chat
    console.log('hei');
    const display = document.querySelector('.display');
    if (display) {
      display.scrollTo(0, display.scrollHeight);
    }
    if (availableChats[activeIndex].unread > 0) {
      dispatchAvailableChats(readMessages(availableChats[activeIndex].roomID));
    }
  }, [availableChats]);

  const onSendTextAndFileMessage = (message: ISocketMessage): void => {
    dispatchAvailableChats(
      addMessage(
        availableChats[activeIndex].roomID,
        generateTextMessageFromPayload(message),
      ),
    );
    socketSend(message);
  };

  const toggleQueueMessage = (): void => {
    // TODO: Toggle queue
    const getMessage: IGetMessage = createGetQueueMessage();
    socketSend(getMessage);
  };

  const onSendGenerateRoomMessage = (studentID: string): void => {
    // TODO: Happens when queue item is chosen
    const student = queue.find(queueItem => queueItem.uniqueID === studentID);
    if (student) {
      /*setAvailableChats(chats => [
        ...chats,
        {
          student,
          messages: [],
          roomID: '',
        },
      ]);*/
    }
    const socketMessage: ISocketMessage = createGenerateRoomMessage(
      uniqueID,
      studentID,
    );
    socketSend(socketMessage);
  };

  return (
    <div className="chat-container">
      <div className="chat-list">
        <ActiveChatsComponent
          showMessages={setActiveIndex}
          availableChats={availableChats}
        />
      </div>
      <div className="chat">
        <button onClick={() => toggleQueueMessage()}>Update queue</button>
        {availableChats && (
          <ChatHeaderComponent
            connectedWith={availableChats[activeIndex].student.nickname}
            course={availableChats[activeIndex].student.subject}
          />
        )}
        {availableChats && (
          <ChatBodyComponent messages={availableChats[activeIndex].messages} />
        )}
        {availableChats && (
          <ChatInputComponent
            uniqueID={uniqueID}
            roomID={availableChats[activeIndex].roomID}
            onSend={onSendTextAndFileMessage}
          />
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
