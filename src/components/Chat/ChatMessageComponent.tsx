import React, { useContext, useMemo, useState } from 'react';
import { ITextMessage } from '../../interfaces';
import { timeStringFromDate } from '../../services';
import { SocketContext } from '../../providers';

interface IProps {
  message: ITextMessage;
}

const ChatMessageComponent = (props: IProps) => {
  const { message, author } = props.message;
  const {name} = useContext(SocketContext);
  // Placeholder for when we get users
  // TODO: change when we have users, to use the username instead
  console.log(author);
  const authorType = author === name ? 'self' : 'other';
  const time = useMemo(() => new Date().getHours() + ':' + new Date().getMinutes(), []);
  const downloadFile = file => {
    const downloadLink = document.createElement('a');
    downloadLink.href = String(file.dataURL);
    downloadLink['download'] = file.name;
    downloadLink.click();
  };


  const renderMessage = () => {
    console.log("Skal renders");
    if (typeof message === 'string') {
      return (
        <p className={`chat-message--message chat-message--${authorType}`}>
          {message}
        </p>
      );
    } else {
      return (
        <div
          className={`chat-message--${authorType} chat-message--download`}
          onClick={() => downloadFile(message)}
        >
          <p className={`chat-message--message`}>
            <span className="chat-message--file-name">
              {message.name} {' | '}
            </span>
            <span className="chat-message--file-size">
              {(message.size / 1000000).toPrecision(3)} MB {' - '}
              {message.type}
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
        <span>{authorType === 'self' ? 'Deg' : author}</span>, kl.{time}
        <span>
          {props.message.datetime && timeStringFromDate(props.message.datetime)}
        </span>
      </p>
      {renderMessage()}
    </div>
  );
};

export default ChatMessageComponent;
