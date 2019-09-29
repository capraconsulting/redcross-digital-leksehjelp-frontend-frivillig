import React, { useContext } from 'react';
import { IChat } from '../../interfaces';
import { SocketContext } from '../../providers';

interface IProps {
  availableChats: IChat[];
  showMessages(index: number): void;
}

const ActiveChatsComponent = (props: IProps) => {
  const { activeChatIndex, setActiveChatIndex } = useContext(SocketContext);
  const { showMessages, availableChats } = props;

  const onClickHandler = (index: number): void => {
    showMessages(index);
    setActiveChatIndex(index);
  };

  const activeChatList = () =>
    availableChats.map((chat, index) => {
      return (
        <div
          onClick={() => onClickHandler(index)}
          key={chat.roomID}
          className={`active-chat ${
            index === activeChatIndex
              ? 'active-chat-active'
              : 'active-chat-inactive'
          }`}
        >
          <div className="chat-info">
            <span className="name">{chat.student.nickname}</span>
            <span className="subject">{chat.student.subject}</span>
          </div>
          <span className="dot">{chat.unread}</span>
        </div>
      );
    });

  return <div className="active-chat-container">{activeChatList()}</div>;
};

export default ActiveChatsComponent;
