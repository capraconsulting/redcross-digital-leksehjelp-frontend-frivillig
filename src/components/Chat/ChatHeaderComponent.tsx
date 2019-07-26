import React, { useContext, useEffect, useRef, useState } from 'react';
import { IChat } from '../../interfaces';
import { SocketContext } from '../../providers';
import { createLeaveChatMessage } from '../../services';
import { leaveChatAction } from '../../reducers';
import { Modal } from '../../components';
import { ModalContext } from '../../providers/ModalProvider';

interface IProps {
  activeChat: IChat;
}

const ChatHeaderComponent = (props: IProps) => {
  const { roomID } = props.activeChat;
  const { nickname, course } = props.activeChat.student;
  const { socketSend, dispatchChats, uniqueID } = useContext(SocketContext);
  const {setIsOpen} = useContext(ModalContext);

  const leaveChat = () => {
    dispatchChats(leaveChatAction(roomID));
    socketSend(createLeaveChatMessage(roomID, uniqueID));
    setIsModalOpen(false);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <div className="chat-header">
      <div className="chat-header--text">
        <span className="chat-header--text--left">
          <p>{nickname}</p>
        </span>
        <span className="chat-header--text--right">
          <p>{course}</p>
          <button
            onClick={() => setIsOpen(true)}
            className="leksehjelp--button-success"
          >
            Forlat Chatten
          </button>
        </span>
      </div>
        <Modal
          content="Er du sikker på at du vil forlate chaten?"
          warningButtonText="Forlat Chatten"
          warningCallback={leaveChat}
          successButtonText="Bli i Chatten"
        />
    </div>
  );
};

export default ChatHeaderComponent;
