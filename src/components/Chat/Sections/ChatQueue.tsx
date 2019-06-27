import React from 'react';

interface IProps {
  queueMembers: string[]
}

const ChatQueue = (props: IProps) => {
  const createList = () => {
    return props.queueMembers.map((listItem, index) => {
      return <li key={index}>{listItem}</li>;
    });
  };

  return (
    <div className="cq-container">
      <ol className="cq-list">{createList()}</ol>
    </div>
  );
};

export default ChatQueue;
