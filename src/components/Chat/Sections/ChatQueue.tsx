import React from 'react';

interface IProps {
  queueMembers: string[];
  createRoomWith;
}

const ChatQueue = (props: IProps) => {
  const createList = () => {
    return props.queueMembers.map((student, index) => {
      return (
        <li key={index}>
          {student}
          <button onClick={() => props.createRoomWith(student)}>Chat</button>
        </li>
      );
    });
  };

  return (
    <div className="cq-container">
      <ol className="cq-list">{createList()}</ol>
    </div>
  );
};

export default ChatQueue;
