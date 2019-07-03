import React from 'react';
import { ITextMessage } from '../../interfaces';
import { timeStringFromDate } from '../../services';

interface IProps {
  message: ITextMessage;
}

const ChatMessageComponent = (props: IProps) => {
  const authorType = props.message.author === 'frivillig' ? 'self' : 'other';

  const downloadFile = file => {
    const downloadLink = document.createElement('a');
    downloadLink.href = String(file.dataURL);
    downloadLink['download'] = file.name;
    downloadLink.click();
  };
  const renderMessage = () => {
    if (typeof props.message.message === 'string') {
      return (
        <p className={`chat-message--message chat-message--${authorType}`}>
          {props.message.message}
        </p>
      );
    } else {
      return (
        <div
          className={`chat-message--${authorType} chat-message--download`}
          onClick={() => downloadFile(props.message.message)}
        >
          <p className={`chat-message--message`}>
            <span className="chat-message--file-name">
              {props.message.message.name} {' | '}
            </span>
            <span className="chat-message--file-size">
              {(props.message.message.size / 1000000).toPrecision(3)} MB {' - '}
              {props.message.message.type}
            </span>
          </p>
          <img
            className="svg-download"
            src={require('../../assets/images/download.svg')}
            alt=""
          />
        </div>
      );
    }
  };
  return (
    <div className="chat-message">
      <p className={`chat-message--author-${authorType}`}>
        <span>{authorType === 'self' ? 'Deg' : props.message.author}</span>, kl.{' '}
        <span>{timeStringFromDate(props.message.datetime)}</span>
      </p>
      {renderMessage()}
    </div>
  );
};

export default ChatMessageComponent;
