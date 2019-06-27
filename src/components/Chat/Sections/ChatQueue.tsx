import React from 'react';

interface IProps {
  queueMembers: string[];
  createRoomWith;
}

const ChatQueue = (props: IProps) => {
  const createList = () => {
    return props.queueMembers.map((student, index) => {
      return <li onClick={() => props.createRoomWith(student)} key={index}>{student}</li>;
    });
  };

  return (
    <div className="cq-container">
      <ol className="cq-list">{createList()}</ol>
    </div>
  );
};

export default ChatQueue;
