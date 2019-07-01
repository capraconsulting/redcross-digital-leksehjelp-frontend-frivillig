import React, { useEffect, useState } from 'react';
import { ChatBody, ChatHeader, ChatInput, ChatQueue } from '../components';
import { IGetMessage, ISocketMessage, ITextMessage } from '../interfaces';
import {
  createGenerateRoomMessage,
  createGetQueueMessage,
} from '../services/message-service';
import { getSocket } from '../utils';

const ChatContainer = () => {
  const [socket, setSocket] = useState(null as any);
  const [messages, setMessages] = useState<ITextMessage[]>([]);
  const [roomID, setRoomID] = useState<string>('');
  const [uniqueID, setUniqueID] = useState<string>('');
  const [queue, setQueue] = useState<string[]>([]);

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
    <div className="chat">
      <ChatHeader connectedWith="Caroline Sandsbråten" course="Engelsk" />
      <button onClick={() => onSendGetQueueMessage()}>Update queue</button>
      <ChatQueue
        createRoomWith={onSendGenerateRoomMessage}
        queueMembers={queue}
      />
      <ChatBody messages={messages} />
      <ChatInput
        uniqueID={uniqueID}
        roomID={roomID}
        onSend={onSendTextAndFileMessage}
      />
    </div>
  );
};

export default ChatContainer;
