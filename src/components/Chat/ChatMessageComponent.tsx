import React from 'react';
import { ITextMessage } from '../../interfaces';
import { IVolunteer } from '../../interfaces';
import Linkify from 'react-linkify';

interface IProps {
  message: ITextMessage;
  volunteerInfo: IVolunteer;
}

const ChatMessageComponent = (props: IProps) => {
  const { message, author, uniqueID, files, datetime, imgUrl } = props.message;

  // Placeholder for when we get users
  // TODO: change when we have users, to use the username instead
  const authorType = author === props.volunteerInfo.name ? 'self' : 'other';

  const downloadFile = file => {
    const a = document.createElement('a');
    a.href = String(file.fileUrl);
    a['download'] = file.fileName;
    a.click();
  };

  const RenderFiles = () => {
    return (
      files &&
      files.length > 0 &&
      files.map((file, index) => {
        return (
          <div className={'chat-message'} key={index}>
            <div
              className={`chat-message--download chat-message--${authorType} chat-message--${authorType}--file`}
            >
              <p className={`chat-message--message`}>
                <span className="chat-message--file-name">
                  {file.fileName}{' '}
                </span>
                <span className="chat-message--file-size">
                  {(1000000 / 1000000).toPrecision(3)} MB
                </span>
              </p>
              <img
                onClick={() => downloadFile(file)}
                className="svg-download"
                src={require('../../assets/images/download.svg')}
                alt=""
              />
            </div>
          </div>
        );
      })
    );
  };

  const messageLinkDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );

  const renderMessage = () => {
    return (
      message &&
      message.length > 0 && (
        <Linkify componentDecorator={messageLinkDecorator}>
          <p
            className={`chat-message--message chat-message--${authorType} chat-message--${authorType}--message`}
          >
            {message}
          </p>
        </Linkify>
      )
    );
  };
  if (uniqueID === 'NOTIFICATION') {
    return (
      <div className="chat-message">
        <p className="chat-message--notification">{message}</p>
      </div>
    );
  } else {
    return (
      <div className="chat-message">
        <img height={10} width={10} src={imgUrl} />
        <p className={`chat-message--author-${authorType}`}>
          <span>{authorType === 'self' ? 'Deg' : author}</span>, kl.{' '}
          <span>{datetime && datetime}</span>
        </p>
        {renderMessage()}
        {RenderFiles()}
      </div>
    );
  }
};

export default ChatMessageComponent;
