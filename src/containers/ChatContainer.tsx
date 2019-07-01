import React, { useEffect, useState } from 'react';
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

const testActiveChats: IChat[] = [
  {
    student: testQueue[0],
    messages: testMessageGenerator(),
    roomID: 'one',
  },
  {
    student: testQueue[1],
    messages: testMessageGenerator(),
    roomID: 'two',
  },
  {
    student: testQueue[2],
    messages: testMessageGenerator(),
    roomID: 'three',
  },
  {
    student: testQueue[3],
    messages: testMessageGenerator(),
    roomID: 'four',
  },
  {
    student: testQueue[4],
    messages: testMessageGenerator(),
    roomID: 'five',
  },
];

const ChatContainer = () => {
  const [availableChats, setAvailableChats] = useState<IChat[]>(
    testActiveChats,
  );
  const [activeMessages, setActiveMessages] = useState<ITextMessage[]>([]);
  const [activeStudent, setActiveStudent] = useState<IStudent>();
  const [activeRoomID, setActiveRoomID] = useState<string>('');

  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<IStudent[]>(testQueue);

  const generateTextMessageFromPayload = (
    message: ISocketMessage,
  ): ITextMessage => {
    return message.payload as ITextMessage;
  };

  const placeIncomingTextMessageCorrectly = (message: ISocketMessage): void => {
    const room = message.payload['roomID'];
    if (room === activeRoomID) {
      setActiveMessages(messages => [
        ...messages,
        generateTextMessageFromPayload(message),
      ]);
    } else {
      const chats = availableChats;
      const chat = chats.find(chat => chat.roomID === room);
      if (chat) chat.messages.push(generateTextMessageFromPayload(message));
      setAvailableChats(chats);
    }
  };

  const setNewRoomID = (message: ISocketMessage): void => {
    const newAvailableChats = availableChats;
    const roomToSetID = newAvailableChats.find(
      chat => chat.student.uniqueID === message.payload['studentID'],
    );
    if (roomToSetID) {
      roomToSetID.roomID = message.payload['roomID'];
    }
    setAvailableChats(newAvailableChats);
  };

  const socketHandler = (message): void => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);

    if (parsedMessage.type === 'textMessage') {
      placeIncomingTextMessageCorrectly(parsedMessage);
    } else if (parsedMessage.type === 'distributeRoomMessage') {
      setNewRoomID(parsedMessage);
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
    const display = document.querySelector('.display');
    if (display) {
      display.scrollTo(0, display.scrollHeight);
    }
  }, [activeMessages]);

  const onSendTextAndFileMessage = (message: ISocketMessage): void => {
    setActiveMessages(messages => [
      ...messages,
      generateTextMessageFromPayload(message),
    ]);
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
      setAvailableChats(chats => [
        ...chats,
        {
          student,
          messages: [],
          roomID: '',
        },
      ]);
    }
    const socketMessage: ISocketMessage = createGenerateRoomMessage(
      uniqueID,
      studentID,
    );
    socketSend(socketMessage);
  };

  const showMessages = (chat: IChat) => {
    /*
     * Updates the list with available chats
     * Then change chat
     */
    if (activeStudent || activeMessages) {
      const tmpChats = availableChats;
      const tmpValue = tmpChats.find(chat => chat.student === activeStudent);
      if (tmpValue) {
        tmpValue.messages = activeMessages;
      }
      setAvailableChats(tmpChats);
    }
    setActiveRoomID(chat.roomID);
    setActiveStudent(chat.student);
    setActiveMessages(chat.messages);
  };

  return (
    <div className="chat-container">
      <div className="chat-list">
        <ActiveChatsComponent
          showMessages={showMessages}
          availableChats={availableChats}
        />
      </div>
      <div className="chat">
        <button onClick={() => toggleQueueMessage()}>Update queue</button>
        {activeStudent && (
          <ChatHeaderComponent
            connectedWith={activeStudent.nickname}
            course={activeStudent.subject}
          />
        )}
        {activeMessages && <ChatBodyComponent messages={activeMessages} />}
        {activeMessages && (
          <ChatInputComponent
            uniqueID={uniqueID}
            roomID={activeRoomID}
            onSend={onSendTextAndFileMessage}
          />
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
