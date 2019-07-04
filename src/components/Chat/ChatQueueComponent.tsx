import React, { useContext, useMemo } from 'react';
import { IStudent } from '../../interfaces';
import { addNewChat } from '../../reducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { createGenerateRoomMessage, createGetQueueMessage } from '../../services';
import { SocketContext } from '../../providers';

const ChatQueueComponent = (props: RouteComponentProps) => {
  const { history } = props;
  const { queue, setQueue, uniqueID, dispatchChats, socketSend } = useContext(
    SocketContext,
  );

  const createNewChatRoom = (student: IStudent) => {
    if (student) {
      dispatchChats(addNewChat(student));
      setQueue(queue.filter(studentInQueue => studentInQueue !== student));
      const socketMessage = createGenerateRoomMessage(
        uniqueID,
        student.uniqueID,
        student.nickname,
        student.grade,
        student.introText,
        student.course,
      );
      socketSend(socketMessage);
      history.push('/messages');
    }
  };

  const updateQueue = () => {
    const socketMessage = createGetQueueMessage();
    socketSend(socketMessage);
  };

  const queueElement = useMemo(
    () =>
      queue.map((student, index) => {
        const { course, nickname, grade, introText } = student;
        return (
          <div className="queue-item-container" key={index}>
            <div className="queue-item">
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
              <hr />
              <div className="queue-body">{introText}</div>
              <hr />
            </div>
            <button>Avslutt Leksehjelp</button>
            <button onClick={() => createNewChatRoom(student)}>
              Start chat
            </button>
          </div>
        );
      }),
    [queue],
  );

  return (
    <div className="queue-container">
      <button onClick={updateQueue}>Update queue</button>
      <div className="queue-category-container">{queueElement}</div>
    </div>
  );
};

export default withRouter(ChatQueueComponent);
