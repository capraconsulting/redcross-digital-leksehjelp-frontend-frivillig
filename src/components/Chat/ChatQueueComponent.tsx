import React, { useContext, useMemo, createRef } from 'react';
import { IStudent } from '../../interfaces';
import { addNewChatAction } from '../../reducers';
import { RouteComponentProps, withRouter } from 'react-router';

import {
  createGetQueueMessage,
  GenerateRoomMessageBuilder,
} from '../../services';
import { SocketContext } from '../../providers';
import { ChatQueueHeader } from '..';

const ChatQueueComponent = (props: RouteComponentProps) => {
  const { history } = props;
  const { queue, setQueue, uniqueID, dispatchChats, socketSend } = useContext(
    SocketContext,
  );

  const createNewChatRoom = (student: IStudent) => {
    if (student) {
      dispatchChats(addNewChatAction(student));
      setQueue(queue.filter(studentInQueue => studentInQueue !== student));

      const msg = new GenerateRoomMessageBuilder(uniqueID)
        .withStudentID(student.uniqueID)
        .withNickname(student.nickname)
        .withGrade(student.grade)
        .withCourse(student.course)
        .withIntroText(student.introText)
        .build();
      socketSend(msg.createMessage);
    }
  };

  const updateQueue = () => {
    const socketMessage = createGetQueueMessage();
    socketSend(socketMessage);
  };

  const queueElement = useMemo(
    () =>
      queue.map((student, index) => {
        const { introText } = student;
        return (
          <div className="queue-item-container" key={index}>
            <div className="queue-item">
              <ChatQueueHeader student={student} />
              <hr />
              <div className="queue-body">{introText}</div>
              <hr />
            </div>
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
        );
      }),
    [queue],
  );

  return (
    <div className="queue-container">
      <button className="leksehjelp--button-success" onClick={updateQueue}>
        Update queue
      </button>
      <div className="queue-category-container">{queueElement}</div>
    </div>
  );
};

export default withRouter(ChatQueueComponent);
