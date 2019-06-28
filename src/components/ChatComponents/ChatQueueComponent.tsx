import React, { useEffect } from 'react';
import { IStudentInQueue } from '../../interfaces';

interface IProps {
  queueMembers: IStudentInQueue[];
  createRoomWith;
}

const ChatQueueComponent = (props: IProps) => {
  const createQueueList = () => {
    return props.queueMembers.map((student, index) => {
      return (
        <div className="queue-item-container" key={index}>
          <div className="queue-item">
            <div className="queue-header">
              <div className="queue-header-item">{student.subject}</div>
              <div className="queue-header-item">
                <span className="queue-nickname">{student.nickname}</span>
                <span className="queue-grade">
                  <span>Klasse: </span>
                  <span>{student.grade}</span>
                </span>
                <span className="queue-type">
                  <img
                    src={require('../../assets/images/chat-icon.svg')}
                    alt="Text Chat"
                  />
                </span>
              </div>
            </div>
            <div className="queue-body">{student.introText}</div>
          </div>
          <button>
            Avslutt Leksehjelp
          </button>
          <button onClick={() => props.createRoomWith(student.uniqueID)}>
            Start chat
          </button>
        </div>
      );
    });
  };

  return <div className="queue-container">{createQueueList()}</div>;
};

export default ChatQueueComponent;
