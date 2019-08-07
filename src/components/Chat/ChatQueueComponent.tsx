import React, { useContext, useMemo, useState } from 'react';
import { IStudent } from '../../interfaces';
import { addNewChatAction } from '../../reducers';
import { RouteComponentProps, withRouter } from 'react-router';

import {
  createGetQueueMessage,
  GenerateRoomMessageBuilder,
} from '../../services';
import { SocketContext } from '../../providers';
import { ChatQueueHeader } from '..';
import { CHAT_TYPES } from '../../config';
import { toast } from 'react-toastify';

toast.configure({
  autoClose: 8000,
  draggable: false,
  position: 'top-center',
  closeButton: false,
  closeOnClick: true,
});

const ChatQueueComponent = (props: RouteComponentProps) => {
  const { history } = props;
  const { queue, setQueue, dispatchChats, socketSend, talky } = useContext(
    SocketContext,
  );
  const {
    LEKSEHJELP_VIDEO,
    MESTRING_VIDEO,
    MESTRING_TEXT,
    LEKSEHJELP_TEXT,
  } = CHAT_TYPES;

  const createNewChatRoom = (student: IStudent) => {
    const { chatType, uniqueID, nickname, grade, introText, subject } = student;
    if (
      talky &&
      (chatType === LEKSEHJELP_VIDEO || chatType === MESTRING_VIDEO)
    ) {
      toast.error(
        'Du er allerede i en videochat med en student.\nVennligst avslutt alle chatter med denne eleven først',
      );
      return;
    }

    if (student) {
      dispatchChats(addNewChatAction(student));
      setQueue(queue.filter(studentInQueue => studentInQueue !== student));
      const msg = new GenerateRoomMessageBuilder(uniqueID)
        .withStudentID(uniqueID)
        .withNickname(nickname)
        .withGrade(grade)
        .withCourse(subject)
        .withIntroText(introText)
        .build();
      socketSend(msg.createMessage);
    }
  };

  const updateQueue = () => {
    const socketMessage = createGetQueueMessage();
    socketSend(socketMessage);
  };

  const renderQueues = (textAllowed: string, videoAllowed: string) =>
    useMemo(() => {
      let hasQueue = false;
      const queueToRender = queue.map((student, index) => {
        const { introText, themes, chatType } = student;
        if (chatType === textAllowed || chatType === videoAllowed) {
          hasQueue = true;
          return (
            <div className="queue-item-container" key={index}>
              <div className="queue-item">
                <ChatQueueHeader student={student} />
                <hr />
                <div className="queue-body">{introText}</div>
                <hr />
              </div>
              <div className="queue-item-button-container tags">
                {themes &&
                  themes.map(theme => (
                    <div
                      key={theme}
                      className="leksehjelp--tag question--list-themes-element"
                    >
                      <p>{theme}</p>
                    </div>
                  ))}
              </div>
              <div className="queue-item-button-container controls">
                <button className="leksehjelp--button-warning">
                  Avslutt Leksehjelp
                </button>
                <button
                  className="leksehjelp--button-success"
                  onClick={() => createNewChatRoom(student)}
                >
                  Start chat
                </button>
              </div>
            </div>
          );
        }
      });
      if (hasQueue) {
        return queueToRender;
      } else {
        return <div>Køen er tom</div>;
      }
    }, [queue, talky]);

  return (
    <div className="queue-container">
      <button className="leksehjelp--button-success" onClick={updateQueue}>
        Update queue
      </button>
      <div className="chat-queue-body-container">
        <div className="queue-title">Leksehjelp</div>
        <div className="queue-category-container">
          {renderQueues(LEKSEHJELP_TEXT, LEKSEHJELP_VIDEO)}
        </div>
      </div>
      <div className="chat-queue-body-container">
        <div className="queue-title">Mestring</div>
        <div className="queue-category-container">
          {renderQueues(MESTRING_TEXT, MESTRING_VIDEO)}
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatQueueComponent);
