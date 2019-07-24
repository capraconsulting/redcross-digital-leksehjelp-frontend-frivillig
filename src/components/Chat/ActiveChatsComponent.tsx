import React, { useState } from 'react';
import { IChat } from '../../interfaces';

interface IProps {
  availableChats: IChat[];
  showMessages(index: number): void;
}

const ActiveChatsComponent = (props: IProps) => {
  const [activeChat, setActiveChat] = useState<number>(0);

  const onClickHandler = (index: number): void => {
    props.showMessages(index);
    setActiveChat(index);
  };

  const activeChatList = () =>
    props.availableChats.map((chat, index) => {
      return (
        <div
          onClick={() => onClickHandler(index)}
          key={chat.roomID}
          className={`active-chat ${
            index === activeChat ? 'active-chat-active' : 'active-chat-inactive'
          }`}
        >
          <div className="chat-info">
            <span className="name">{chat.student.nickname}</span>
            <span className="subject">{chat.student.course}</span>
          </div>
          <span className="dot">{chat.unread}</span>
        </div>
      );
    });

  return <div className="active-chat-container">{activeChatList()}</div>;
};

export default ActiveChatsComponent;
