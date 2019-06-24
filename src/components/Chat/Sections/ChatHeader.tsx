import React from 'react';
import '../../../styles/ChatHeader';

interface IProps {
  connectedWith: string;
  course: string;
}

const ChatHeader = (props: IProps) => {
  return (
    <div className={`ch`}>
      {/*<span className={'ch--left'}>
        <p>{props.connectedWith}</p>
      </span>
      <span className={'ch--right'}>{unreadMessages}</span>*/}
      <div className={'ch--text'}>
        <p className={'ch--text--left'}>{props.connectedWith}</p>
        <p className={'ch--text--right'}>{props.course}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
