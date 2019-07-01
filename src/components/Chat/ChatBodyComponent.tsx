import React, { useMemo } from 'react';
import { ChatMessage } from '../';
import { ITextMessage } from '../../interfaces';

interface IProps {
  messages: ITextMessage[];
}

const ChatBodyComponent = (props: IProps) => {
  const listMessages = useMemo(
    () =>
      props.messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      )),
    [props.messages],
  );

  return (
    <div className="chat-body-container">
      <div className="display" id="message-display">
        <div className="welcome-container">
          <p className="welcome-header">Velkommen til chaten!</p>
          <p className="welcome-body">
            Hvis du sender et vedlegg må du gjerne fjerne navnet ditt eller
            andre ting fra dokumentet som kan indentifisere deg.
          </p>
        </div>
        {listMessages}
      </div>
    </div>
  );
};

export default ChatBodyComponent;
