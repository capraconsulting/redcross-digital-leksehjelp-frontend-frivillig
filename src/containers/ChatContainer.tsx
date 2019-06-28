import React, { useEffect, useState } from 'react';
import ChatBodyComponent from '../components/ChatComponents/ChatBodyComponent';
import ChatHeaderComponent from '../components/ChatComponents/ChatHeaderComponent';
import ChatQueueComponent from '../components/ChatComponents/ChatQueueComponent';
import ChatInputComponent from '../components/ChatComponents/ChatInputComponent';
import { IGetMessage, ISocketMessage, ITextMessage } from '../interfaces';
import {
  createGenerateRoomMessage,
  createGetQueueMessage,
} from '../services/message-service';
import { CHAT_URL } from '../config';

const ChatContainer = () => {
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
    const getMessage: IGetMessage = createGetQueueMessage();
    socket.send(JSON.stringify(getMessage));
  };

  const onSendGenerateRoomMessage = (studentID: string): void => {
    const socketMessage: ISocketMessage = createGenerateRoomMessage(uniqueID, studentID);
    socket.send(JSON.stringify(socketMessage));
  };

  return (
    <div className={'chat'}>
      <ChatHeaderComponent
        connectedWith="Caroline Sandsbråten"
        course="Engelsk"
      />
      <button onClick={() => onSendGetQueueMessage()}>Update queue</button>
      <ChatQueueComponent
        createRoomWith={onSendGenerateRoomMessage}
        queueMembers={queue}
      />
      <ChatBodyComponent messages={messages} />
      <ChatInputComponent
        uniqueID={uniqueID}
        roomID={roomID}
        onSend={onSendTextAndFileMessage}
      />
    </div>
  );
};

export default ChatContainer;
