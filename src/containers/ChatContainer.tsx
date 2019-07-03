import React, { useContext, useEffect, useState } from 'react';
import ChatBodyComponent from '../components/Chat/ChatBodyComponent';
import ChatHeaderComponent from '../components/Chat/ChatHeaderComponent';
import ChatInputComponent from '../components/Chat/ChatInputComponent';
import { IChat, ISocketMessage, ITextMessage } from '../interfaces';

import ActiveChatsComponent from '../components/Chat/ActiveChatsComponent';
import { addMessage, readMessages, setChatFromLocalStorage } from '../reducers';
import { SocketContext } from '../providers';

// main component
const ChatContainer = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { uniqueID, chats, dispatchChats, socketSend } = useContext(
    SocketContext,
  );

  const generateTextMessageFromPayload = (
    message: ISocketMessage,
  ): ITextMessage => {
    return message.payload as ITextMessage;
  };

  useEffect(() => {
    // Auto scroll down in chat
    const display = document.querySelector('.display');
    if (display) {
      display.scrollTo(0, display.scrollHeight);
    }
  }, [chats]);

  const onSendTextAndFileMessage = (message: ISocketMessage): void => {
    dispatchChats(addMessage(generateTextMessageFromPayload(message)));
    socketSend(message);
  };

  const showMessages = (index: number) => {
    setActiveIndex(index);
    dispatchChats(readMessages(chats[activeIndex].roomID));
  };

  if (chats.length > 0) {
    return (
      <div className="chat-container">
        <div className="chat-list">
          <ActiveChatsComponent
            showMessages={showMessages}
            availableChats={chats}
          />
        </div>
        <div className="chat">
          {chats && (
            <ChatHeaderComponent
              connectedWith={chats[activeIndex].student.nickname}
              course={chats[activeIndex].student.course}
            />
          )}
          {chats && (
            <ChatBodyComponent messages={chats[activeIndex].messages} />
          )}
          {chats && (
            <ChatInputComponent
              uniqueID={uniqueID}
              roomID={chats[activeIndex].roomID}
              onSend={onSendTextAndFileMessage}
            />
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="chat-container">
      <div />
      <div className="no-chat">Ingen chats</div>
    </div>
  );
};

export default ChatContainer;
