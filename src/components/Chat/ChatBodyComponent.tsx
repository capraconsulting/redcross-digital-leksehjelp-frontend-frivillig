import React from 'react';
import { ITextMessage } from '../../interfaces';
import ChatMessageComponent from './ChatMessageComponent';

interface IProps {
  messages: ITextMessage[];
}

const ChatBodyComponent = (props: IProps) => {
  console.log(props.messages);
  const listMessages = () => {
    return props.messages.map((message, index) => (
      <ChatMessageComponent key={index} message={message} />
    ));
  };

  return (
    <div className="chat-body-container">
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
