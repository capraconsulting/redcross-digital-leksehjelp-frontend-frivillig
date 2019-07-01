import React, { useMemo, useState } from 'react';
import { IChat } from '../../interfaces';

interface IProps {
  availableChats: IChat[];
  showMessages(chat: IChat): void;
}

const ActiveChatsComponent = (props: IProps) => {
  const [activeChat, setActiveChat] = useState<number>();

  const onClickHandler = (index: number): void => {
    props.showMessages(props.availableChats[index]);
    setActiveChat(index);
  };

  const activeChatList = () => (
      props.availableChats.map((chat, index) => (
        <div
          onClick={() => onClickHandler(index)}
          key={index}
          className={`active-chat ${
            index === activeChat
              ? 'active-chat-active'
              : 'active-chat-inactive'
          }`}
        >
          <div className="chat-info">
            <span className="name">{chat.student.nickname}</span>
            <span className="subject">{chat.student.subject}</span>
          </div>
          <span className="dot">1</span>
        </div>
      )));

  return <div className="active-chat-container">{activeChatList()}</div>;
};

export default ActiveChatsComponent;
