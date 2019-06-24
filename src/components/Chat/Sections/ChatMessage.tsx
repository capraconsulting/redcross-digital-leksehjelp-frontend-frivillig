import React from 'react';
import IMessage from '../../../interfaces/IMessage';
import '../../../styles/ChatMessage.less';

interface IProps {
  message: IMessage;
}

const ChatMessage = (props: IProps) => {
  const authorType = props.message.author === 'Deg' ? 'self' : 'other';
  return (
    <div className={`cm`}>
      <p className={`cm--author-${authorType}`}>{props.message.author}</p>
      <p className={`cm--message cm--${authorType}`}>{props.message.message}</p>
    </div>
  );
};

export default ChatMessage;
