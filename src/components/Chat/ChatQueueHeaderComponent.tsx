import React, { useEffect, useState } from 'react';
import { IStudent } from '../../interfaces';
import { CHAT_TYPES } from '../../config';

interface IProps {
  student: IStudent;
}

const ChatQueueHeaderComponent = (props: IProps) => {
  const { subject, nickname, grade, chatType, positionInQueue } = props.student;
  const {
    LEKSEHJELP_VIDEO,
    LEKSEHJELP_TEXT,
    MESTRING_VIDEO,
    MESTRING_TEXT,
  } = CHAT_TYPES;

  return (
    <div className="queue-header">
      <div className="queue-header-item">
        <span>{subject}</span>
        <span className="queue-type">
          {(chatType === LEKSEHJELP_VIDEO || chatType === MESTRING_VIDEO) && (
            <img
              src={require('../../assets/images/video-icon.svg')}
              alt="Video Chat"
            />
          )}
          {(chatType === LEKSEHJELP_TEXT || chatType === MESTRING_TEXT) && (
            <img
              src={require('../../assets/images/chat-icon.svg')}
              alt="Text Chat"
            />
          )}
        </span>
      </div>
      <div className="queue-header-item">
        <span className="queue-nickname">{nickname}</span>
      </div>
      <div className="queue-header-item">
        <span className="queue-grade">
          <span>Klasse: </span>
          <span>{grade}</span>
        </span>
        <span className="queue-grade">
          <span>Posisjon i kø: </span>
          <span>{positionInQueue}</span>
        </span>
      </div>
    </div>
  );
};

export default ChatQueueHeaderComponent;
