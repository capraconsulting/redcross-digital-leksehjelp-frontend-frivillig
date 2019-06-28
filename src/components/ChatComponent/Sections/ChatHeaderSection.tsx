import React from 'react';

interface IProps {
  connectedWith: string;
  course: string;
}

const ChatHeaderSection = (props: IProps) => {
  return (
    <div className={`chat-header`}>
      <div className={'chat-header--text'}>
        <p className={'chat-header--text--left'}>{props.connectedWith}</p>
        <p className={'chat-header--text--right'}>{props.course}</p>
      </div>
    </div>
  );
};

export default ChatHeaderSection;
