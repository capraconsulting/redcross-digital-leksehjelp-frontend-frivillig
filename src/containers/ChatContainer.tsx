import React, { useContext, useEffect, useState } from 'react';
import { ActiveChats, ChatInput, ChatBody, ChatHeader } from '../components';
import { readMessagesAction } from '../reducers';
import { SocketContext } from '../providers';
import AvailableVolunteersComponent from '../components/Chat/AvailableVolunteersComponent';

// main component
const ChatContainer = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { uniqueID, chats, dispatchChats, availableVolunteers } = useContext(SocketContext);
  const [popup, setPopup] = useState<boolean>(false);


  useEffect(() => {
    // Auto scroll down in chat
    const display = document.querySelector('.display');
    if (display) {
      display.scrollTo(0, display.scrollHeight);
    }
  }, [chats]);

  const showMessages = (index: number) => {
    setActiveIndex(index);
    dispatchChats(readMessagesAction(chats[activeIndex].roomID));
  };

  const func = () => {
    setPopup(true);
  }

  const close = () => {
    setPopup(false);
  }

  if(popup){
    return(
      <AvailableVolunteersComponent
        availableVolunteers={availableVolunteers}
        closePopup={close}/>
    )
  }
  if (chats.length >= 1) {
    return (
      <div className="chat-container">
        <div className="chat-list">
          <ActiveChats showMessages={showMessages} availableChats={chats} />
        </div>
        <div className="chat">
          {chats && <ChatHeader activeChat={chats[activeIndex]} />}
          {chats && <ChatBody messages={chats[activeIndex].messages} />}
          {chats && (
            <ChatInput uniqueID={uniqueID} roomID={chats[activeIndex].roomID} />
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
