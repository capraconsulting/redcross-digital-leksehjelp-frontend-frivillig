import React, { useContext, useEffect } from 'react';
import { ActiveChats, ChatBody, ChatHeader, ChatInput } from '../components';
import { readMessagesAction } from '../reducers';
import { SocketContext } from '../providers';

// main component
const ChatContainer = () => {
  const {
    uniqueID,
    chats,
    dispatchChats,
    activeChatIndex,
    setActiveChatIndex,
  } = useContext(SocketContext);

  useEffect(() => {
    // Auto scroll down in chat
    const display = document.querySelector('.display');
    if (display) {
      display.scrollTo(0, display.scrollHeight);
    }
  }, [chats]);

  const showMessages = (index: number) => {
    setActiveChatIndex(index);
    dispatchChats(readMessagesAction(chats[activeChatIndex].roomID));
  };

  if (chats.length >= 1) {
    return (
      <div className="chat-container">
        <div className="chat-list">
          <ActiveChats showMessages={showMessages} availableChats={chats} />
        </div>
        <div className="chat">
          {chats && chats[activeChatIndex] && (
            <ChatHeader activeChat={chats[activeChatIndex]} />
          )}
          {chats && chats[activeChatIndex] && (
            <ChatBody messages={chats[activeChatIndex].messages} />
          )}
          {chats && chats[activeChatIndex] && (
            <ChatInput
              uniqueID={uniqueID}
              roomID={chats[activeChatIndex].roomID}
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
