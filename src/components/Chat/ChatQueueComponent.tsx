import React, { useContext, useMemo } from 'react';
import { IStudent } from '../../interfaces';
import { addNewChatAction } from '../../reducers';
import { RouteComponentProps, withRouter } from 'react-router';

import { GenerateRoomMessageBuilder } from '../../services';
import { SocketContext } from '../../providers';
import { ChatQueueHeader } from '..';
import { CHAT_TYPES, MESSAGE_TYPES } from '../../config';
import { toast } from 'react-toastify';

const ChatQueueComponent = (props: RouteComponentProps) => {
  const { history } = props;
  const {
    queue,
    setQueue,
    dispatchChats,
    socketSend,
    talky,
    setActiveChatIndex,
    chats,
    volunteerInfo,
  } = useContext(SocketContext);
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
      setActiveChatIndex(chats.length);
      dispatchChats(addNewChatAction(student));
      setQueue(queue.filter(studentInQueue => studentInQueue !== student));
      const msg = new GenerateRoomMessageBuilder(uniqueID)
        .withStudentID(uniqueID)
        .withNickname(nickname)
        .withGrade(grade)
        .withCourse(subject)
        .withIntroText(introText)
        .withVolName(volunteerInfo.name)
        .build();
      socketSend(msg.createMessage);
    }
  };

  const removeStudentFromQueue = (student: IStudent) => {
    if (student.uniqueID) {
      socketSend({
        msgType: MESSAGE_TYPES.REMOVE_STUDENT_FROM_QUEUE,
        payload: {
          uniqueID: student.uniqueID,
          removedBy: 'volunteer',
        },
      });
    }
    setQueue(queue.filter(studentInQueue => studentInQueue !== student));
  };

  const renderQueues = (textAllowed: string, videoAllowed: string) =>
    useMemo(() => {
      let hasQueue = false;
      const queueToRender = queue.map((student, index) => {
        const { introText, themes, chatType } = student;
        if (chatType === textAllowed || chatType === videoAllowed) {
          hasQueue = true;
          return (
            <div className="queue-item-container side-margin" key={index}>
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
                <button
                  onClick={() => removeStudentFromQueue(student)}
                  className="leksehjelp--button-warning"
                >
                  Avslutt Leksehjelp
                </button>
                <button
                  className="leksehjelp--button-success"
                  onClick={() => {
                    createNewChatRoom(student);
                    setTimeout(() => history.push('/messages'), 1000);
                  }}
                >
                  Åpne {chatType === LEKSEHJELP_TEXT ? 'chat' : 'videochat'}.
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
