import React from 'react';
import ChatMessageSection from './ChatMessageSection';
import { ITextMessage } from '../../../interfaces/ITextMessage';

interface IProps {
  messages: ITextMessage[];
}

const ChatBodySection = (props: IProps) => {
  const mapMessages = () => {
    return props.messages.map((message, index) => {
      return <ChatMessageSection key={index} message={message} />;
    });
  };

  return (
    <div className={'chat-body-container'}>
      <div className={'display'} id="message-display">
        <div className={'welcome-container'}>
          <p className="welcome-header">Velkommen til chaten!</p>
          <p className="welcome-body">
            Hvis du sender et vedlegg må du gjerne fjerne navnet ditt eller
            andre ting fra dokumentet som kan indentifisere deg.
          </p>
        </div>
        {mapMessages()}
      </div>
    </div>
  );
};

export default ChatBodySection;
