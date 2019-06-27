import React from 'react';
import { ITextMessage } from '../../../interfaces/IMessage';
import '../../../styles/ChatMessage.less';
import { NorwegianTime } from '../../../services/date-service';

interface IProps {
  message: ITextMessage;
}

const ChatMessage = (props: IProps) => {
  const authorType = props.message.author === 'student' ? 'self' : 'other';

  const downloadFile = file => {
    const a = document.createElement('a');
    a.href = String(file.dataURL);
    a['download'] = file.name;
    a.click();
  };
  const renderMessage = () => {
    if (typeof props.message.message === 'string') {
      return (
        <p className={`cm--message cm--${authorType}`}>
          {props.message.message}
        </p>
      );
    } else {
      return (
        <div
          className={`cm--${authorType} cm--download`}
          onClick={() => downloadFile(props.message.message)}
        >
          <p className={`cm--message`}>
            <span className="cm--file-name">
              {props.message.message.name} {' | '}
            </span>
            <span className="cm--file-size">
              {(props.message.message.size / 1000000).toPrecision(3)} MB {' - '}
              {props.message.message.type}
            </span>
          </p>
          <img
            className="svg-download"
            src={require('../../../assets/images/download.svg')}
            alt=""
          />
        </div>
      );
    }
  };
  return (
    <div className={`cm`}>
      <p className={`cm--author-${authorType}`}>
        <span>{authorType === 'self' ? 'Deg' : props.message.author}</span>, kl.{' '}
        <span>{NorwegianTime(props.message.datetime)}</span>
      </p>
      {renderMessage()}
    </div>
  );
};

export default ChatMessage;
