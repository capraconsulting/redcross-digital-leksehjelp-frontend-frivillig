import React, { useContext, useState } from 'react';
import { IChat } from '../../interfaces';
import { SocketContext } from '../../providers';
import { leaveChatAction } from '../../reducers';
import { Modal } from '../../components';
import { LeaveChatMessageBuilder } from '../../services';

interface IProps {
  activeChat: IChat;
}

const ChatHeaderComponent = (props: IProps) => {
  const { roomID } = props.activeChat;
  const { nickname, course } = props.activeChat.student;
  const { socketSend, dispatchChats, uniqueID } = useContext(SocketContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const leaveChat = () => {
    dispatchChats(leaveChatAction(roomID));
    const msg = new LeaveChatMessageBuilder(uniqueID).toRoom(roomID).build();
    socketSend(msg.createMessage);
    setModalOpen(false);
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
            onClick={() => setModalOpen(true)}
            className="leksehjelp--button-success"
          >
            Forlat Chatten
          </button>
        </span>
      </div>
      {modalOpen && (
        <Modal
          content="Er du sikker på at du vil forlate chatten?"
          warningButtonText="Forlat Chatten"
          warningCallback={leaveChat}
          successButtonText="Bli i Chatten"
          closingCallback={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatHeaderComponent;
