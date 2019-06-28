import React, { useEffect, useState } from 'react';
import ChatBodySection from './Sections/ChatBodySection';
import ChatHeaderSection from './Sections/ChatHeaderSection';
import ChatQueueSection from './Sections/ChatQueueSection';
import ChatInputSection from './Sections/ChatInputSection';
import { IGetMessage, ISocketMessage, ITextMessage } from '../../interfaces';
import {
  createGenerateRoomMessage,
  createGetQueueMessage,
} from '../../services/message-service';
import { CHAT_URL } from '../../config';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null as any);
  const [messages, setMessages] = useState([] as ITextMessage[]);
  const [roomID, setRoomID] = useState('' as string);
  const [uniqueID, setUniqueID] = useState('' as string);
  const [queue, setQueue] = useState([] as string[]);

  useEffect(() => {
    setSocket(new WebSocket(CHAT_URL));
  }, []);

  const generateTextMessageFromPayload = (
    message: ISocketMessage,
  ): ITextMessage => {
    return {
      author: message.payload['author'],
      roomID: message.payload['roomID'],
      uniqueID: message.payload['uniqueID'],
      message: message.payload['message'],
      datetime: message.payload['datetime'],
    };
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
  });

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
    const msg: IGetMessage = createGetQueueMessage();
    socket.send(JSON.stringify(msg));
  };

  const onSendGenerateRoomMessage = (studentID: string): void => {
    const msg: ISocketMessage = createGenerateRoomMessage(uniqueID, studentID);
    socket.send(JSON.stringify(msg));
  };

  return (
    <div className={'chat'}>
      <ChatHeaderSection
        connectedWith="Caroline Sandsbråten"
        course="Engelsk"
      />
      <button onClick={() => onSendGetQueueMessage()}>Update queue</button>
      <ChatQueueSection
        createRoomWith={onSendGenerateRoomMessage}
        queueMembers={queue}
      />
      <ChatBodySection messages={messages} />
      <ChatInputSection
        uniqueID={uniqueID}
        roomID={roomID}
        onSend={onSendTextAndFileMessage}
      />
    </div>
  );
};

export default ChatComponent;
