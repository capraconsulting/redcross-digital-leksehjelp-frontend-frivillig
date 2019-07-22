import React from 'react';
import { IStudent } from '../../interfaces';

interface IProps {
  student: IStudent;
}

const ChatQueueHeaderComponent = (props: IProps) => {
  const { course, nickname, grade } = props.student;
  return (
    <div className="queue-header">
      <div className="queue-header-item">{course}</div>
      <div className="queue-header-item">
        <span className="queue-nickname">{nickname}</span>
        <span className="queue-grade">
          <span>Klasse: </span>
          <span>{grade}</span>
        </span>
        <span className="queue-type">
          <img
            src={require('../../assets/images/chat-icon.svg')}
            alt="Text Chat"
          />
        </span>
      </div>
    </div>
  );
};

export default ChatQueueHeaderComponent;
