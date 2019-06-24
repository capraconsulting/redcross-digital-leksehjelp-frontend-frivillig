import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import IMessage from '../../../interfaces/IMessage';
import '../../../styles/ChatBody';

interface IProps {
  messages: IMessage[];
  send;
}

const ChatBody = (props: IProps) => {
  const [message, setMessage] = useState({
    author: 'Deg',
    message: '',
  } as IMessage);

  const mapMessages = () => {
    return props.messages.map((message, index) => {
      return <ChatMessage key={index} message={message} />;
    });
  };

  const send = event => {
    event.preventDefault();
    if (message.message.length > 0) {
      props.send(message);
      const tmpMsg = message;
      tmpMsg.message = '';
      setMessage(tmpMsg);
    }
  };

  return (
    <div className={'cb'}>
      <div className={'display'}>{mapMessages()}</div>
      <div className={'message-form-container'}>
        <form className={'message-form'}>
          <input
            type="file"
            name="attachment"
            id="file-input"
            accept="image/*|.pdf|.doc|.docx"
            className="file"
          />
          <button type="button" className="upload">
            <span className="plus">+</span>
            <div className="tooltip">
              Hvis du sender et vedlegg, må du gjerne fjerne navnet ditt eller
              andre ting fra dokumentet som kan identifisere deg.
            </div>
          </button>
          <input
            className={'message-text'}
            type="textarea"
            value={message.message}
            onChange={event =>
              setMessage({
                message: event.target.value,
                author: message.author,
              })
            }
          />
          <button onClick={event => send(event)} className={'send-message'}>
            <svg width="30px" height="30px" viewBox="0 0 30 30">
              <polygon
                className="arrow"
                points="30 15 0 30 5.5 15 0 0"
              ></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBody;
