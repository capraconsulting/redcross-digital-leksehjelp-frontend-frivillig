import React, { useContext, useEffect } from 'react';
import { ActiveChats, ChatBody, ChatHeader, ChatInput } from '../components';
import { readMessagesAction } from '../reducers';
import { SocketContext } from '../providers';

const ChatContainer = () => {
  const {
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
    if (chats[activeChatIndex]) {
      dispatchChats(readMessagesAction(chats[activeChatIndex].roomID));
    }
  }, [chats[activeChatIndex]]);

  const showMessages = (index: number) => {
    setActiveChatIndex(index);
    dispatchChats(readMessagesAction(chats[activeChatIndex].roomID));
  };

  if (chats.length >= 1) {
    return (
      <div className="chat-container">
        <ActiveChats showMessages={showMessages} availableChats={chats} />
        <div className="chat">
          {chats && chats[activeChatIndex] && (
            <>
              <ChatHeader activeChat={chats[activeChatIndex]} />
              <ChatBody messages={chats[activeChatIndex].messages} />
              <ChatInput roomID={chats[activeChatIndex].roomID} />
            </>
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
