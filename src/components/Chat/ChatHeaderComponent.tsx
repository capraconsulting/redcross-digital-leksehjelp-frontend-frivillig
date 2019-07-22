import React, { useContext } from 'react';
import { IChat } from '../../interfaces';
import { SocketContext } from '../../providers';
import { createLeaveChatMessage } from '../../services';
import { leaveChatAction } from '../../reducers';

interface IProps {
  activeChat: IChat;
}

const ChatHeaderComponent = (props: IProps) => {
  const { roomID } = props.activeChat;
  const { nickname, course } = props.activeChat.student;
  const { socketSend, dispatchChats, uniqueID } = useContext(SocketContext);

  const leaveChat = () => {
    dispatchChats(leaveChatAction(roomID));
    socketSend(createLeaveChatMessage(roomID, uniqueID));
  };

  return (
    <div className="chat-header">
      <div className="chat-header--text">
        <span className="chat-header--text--left">
          <p>{nickname}</p>
        </span>
        <span className="chat-header--text--right">
          <p>{course}</p>
          <button onClick={leaveChat}>Leave Chat</button>
        </span>
      </div>
    </div>
  );
};

export default ChatHeaderComponent;
