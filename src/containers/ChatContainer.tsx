import React, { useContext, useEffect, useState } from 'react';
import { ActiveChats, ChatInput, ChatBody, ChatHeader, Modal } from '../components';
import { readMessagesAction } from '../reducers';
import { SocketContext } from '../providers';
import AvailableVolunteersComponent from '../components/Chat/AvailableVolunteersComponent';
import ModalComponent from '../components/ModalComponent';
import { act } from 'react-dom/test-utils';

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
    console.log("Leser meldiger nå");
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
    console.log(availableVolunteers)
    return(

      <Modal
        content={"Tilgjengelige frivillige"}
        successButtonText={'Publiser svaret'}
        warningButtonText={'Ikke publiser'}
        successCallback={close}
        warningCallback={close}
        hideButtons={false}
        handleClose={() => setPopup(false)}
        volunteers={availableVolunteers}
        roomID={chats[activeIndex].roomID}
        student={chats[activeIndex].student}
        messages={chats[activeIndex].messages}
      />
      /*
      <AvailableVolunteersComponent
        availableVolunteers={availableVolunteers}
        closePopup={close}/>
      */
    )
  }
  if (chats.length >= 1) {
    console.log("antall chats");
    console.log(chats.length);
    return (
      <div className="chat-container">
        <div className="chat-list">
          <ActiveChats showMessages={showMessages} availableChats={chats} />
        </div>
        <div className="chat">
          {chats && <ChatHeader activeChat={chats[activeIndex]} />}
          {chats && <ChatBody messages={chats[activeIndex].messages} />}
          {chats && (
            <ChatInput
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
