import React from 'react';

interface IProps {
  connectedWith: string;
  course: string;
}

const ChatHeaderComponent = (props: IProps) => {
  const { connectedWith, course } = props;
  return (
    <div className="chat-header">
      <div className="chat-header--text">
        <p className="chat-header--text--left">{connectedWith}</p>
        <p className="chat-header--text--right">{course}</p>
      </div>
    </div>
  );
};

export default ChatHeaderComponent;
