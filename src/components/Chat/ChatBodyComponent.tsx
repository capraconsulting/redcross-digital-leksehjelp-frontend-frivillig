import React, { useContext, useState } from 'react';
import { ITextMessage } from '../../interfaces';
import ChatMessageComponent from './ChatMessageComponent';
import { Modal } from '../../components';
import { SocketContext } from '../../providers';
import { createJoinChatMessage, JoinChatMessageBuilder } from '../../services';

interface IProps {
  messages: ITextMessage[];
  openModal: boolean;
  setModal(openModalFlag: boolean): void;
}

const ChatBodyComponent = (props: IProps) => {
  const {
    availableVolunteers,
    socketSend,
    activeChatIndex,
    chats,
    volunteerInfo,
  } = useContext(SocketContext);

  const { openModal, messages, setModal } = props;

  const listMessages = () => {
    return messages.map((message, index) => (
      <ChatMessageComponent
        key={index}
        message={message}
        volunteerInfo={volunteerInfo}
      />
    ));
  };

  const createFrivilligOptions = () => {
    return availableVolunteers.map(volunteer => {
      return {
        inputText: volunteer.name,
        buttonText: 'Legg til',
        callback: () =>
          socketSend(
            new JoinChatMessageBuilder()
              .withRoomID(chats[activeChatIndex].roomID)
              .withChatHistory(chats[activeChatIndex].messages)
              .withStudentInfo(chats[activeChatIndex].student)
              .withUniqueID(volunteer.chatID)
              .build()
              .createMessage(),
          ),
        isDisabled: true,
      };
    });
  };

  return (
    <div className="chat-body-container">
      {openModal && (
        <Modal
          content="Tilgjengelige frivillige"
          inputFields={createFrivilligOptions()}
          closingCallback={() => setModal(false)}
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
