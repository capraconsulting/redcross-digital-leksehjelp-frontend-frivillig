import React, {useMemo} from 'react';

interface IProps {
  queueMembers: string[];
  createRoomWith(studentID: string): void;
}

const ChatQueueComponent = (props: IProps) => {

  const queue = useMemo(
    () => props.queueMembers.map((student, index) => (
      <li key={index}>
        {student}
        <button onClick={() => props.createRoomWith(student)}>Chat</button>
      </li>
    )),
    [props.queueMembers]
  );

  return (
    <div className="chat-queue-container">
      <ol className="chat-queue-list">{queue}</ol>
    </div>
  );
};

export default ChatQueueComponent;
