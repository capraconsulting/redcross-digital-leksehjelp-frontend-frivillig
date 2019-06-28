import React from 'react';

interface IProps {
  queueMembers: string[];
  createRoomWith;
}

const ChatQueueComponent = (props: IProps) => {
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
    <div className="chat-queue-container">
      <ol className="chat-queue-list">{createList()}</ol>
    </div>
  );
};

export default ChatQueueComponent;
