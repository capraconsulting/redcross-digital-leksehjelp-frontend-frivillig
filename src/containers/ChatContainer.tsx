import React, { useContext, useEffect, useState } from 'react';
import ChatBodyComponent from '../components/Chat/ChatBodyComponent';
import ChatHeaderComponent from '../components/Chat/ChatHeaderComponent';
import ChatInputComponent from '../components/Chat/ChatInputComponent';

import ActiveChatsComponent from '../components/Chat/ActiveChatsComponent';
import { readMessages } from '../reducers';
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
    dispatchChats(readMessages(chats[activeIndex].roomID));
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
            <ChatBodyComponent
              messages={chats[activeIndex].messages}
            />
          )}
          {chats && (
            <ChatInputComponent
              uniqueID={uniqueID}
              roomID={chats[activeIndex].roomID}
              student={chats[activeIndex].student}
              popUp={func}
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
