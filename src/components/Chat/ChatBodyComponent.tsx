import React, { useContext } from 'react';
import { ITextMessage } from '../../interfaces';
import ChatMessageComponent from './ChatMessageComponent';
import { Modal } from '../../components';
import { SocketContext } from '../../providers';
import { createJoinChatMessage, JoinChatMessageBuilder } from '../../services';
import { ModalContext } from '../../providers/ModalProvider';

interface IProps {
  messages: ITextMessage[];
}

const ChatBodyComponent = (props: IProps) => {
  const {
    availableVolunteers,
    socketSend,
    activeChatIndex,
    chats,
  } = useContext(SocketContext);
  const { isOpen, setIsOpen } = useContext(ModalContext);

  const listMessages = () => {
    return props.messages.map((message, index) => (
      <ChatMessageComponent key={index} message={message} />
    ));
  };

  const createFrivilligOptions = () => {
    return availableVolunteers.map((vol: string) => {
      console.log(chats[activeChatIndex].roomID);
      return {
        inputText: vol,
        buttonText: 'Legg til',
        callback: () =>
          socketSend(
            new JoinChatMessageBuilder()
              .withRoomID(chats[activeChatIndex].roomID)
              .withChatHistory(chats[activeChatIndex].messages)
              .withStudentInfo(chats[activeChatIndex].student)
              .withUniqueID(vol)
              .build()
              .createMessage()
            ,
          ),
        isDisabled: true,
      };
    });
  };

  return (
    <div className="chat-body-container">
      {isOpen && (
        <Modal
          content="Tilgjengelige frivillige"
          inputFields={createFrivilligOptions()}
          closingCallback={() => setIsOpen(false)}
        />
      )}
      <div className="display" id="message-display">
        <div className="welcome-container">
          <p className="welcome-header">Velkommen til chaten!</p>
          <p className="welcome-body">
            Hvis du sender et vedlegg må du gjerne fjerne navnet ditt eller
            andre ting fra dokumentet som kan identifisere deg.
          </p>
        </div>
        {listMessages()}
      </div>
    </div>
  );
};

export default ChatBodyComponent;
