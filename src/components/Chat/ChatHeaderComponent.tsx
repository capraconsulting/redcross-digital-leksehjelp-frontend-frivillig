import React, { useContext, useEffect, useRef, useState } from 'react';
import { IChat } from '../../interfaces';
import { SocketContext } from '../../providers';
import { createLeaveChatMessage } from '../../services';
import { leaveChatAction } from '../../reducers';
import { Modal } from '../../components';

interface IProps {
  activeChat: IChat;
}

const ChatHeaderComponent = (props: IProps) => {
  const { roomID } = props.activeChat;
  const { nickname, course } = props.activeChat.student;
  const { socketSend, dispatchChats, uniqueID } = useContext(SocketContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const leaveChat = () => {
    dispatchChats(leaveChatAction(roomID));
    socketSend(createLeaveChatMessage(roomID, uniqueID));
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
            onClick={() => setIsModalOpen(true)}
            className="leksehjelp--button-success"
          >
            Forlat Chatten
          </button>
        </span>
      </div>
      {isModalOpen && (
        <Modal
          content="Er du sikker på at du vil forlate chaten?"
          warningButtonText="Forlat Chatten"
          warningCallback={leaveChat}
          successButtonText="Bli i Chatten"
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ChatHeaderComponent;
