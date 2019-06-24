import React, { useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import { ChatBody, ChatHeader } from '../../ui/components';
import IMessage from '../../interfaces/IMessage';
import '../../styles/Chat.less';

const Chat = () => {
  // const socket = openSocket('http://localhost:8000'); // TODO: Remember to uncomment

  const [messages, setMessages] = useState([
    {
      author: 'Caroline',
      message: 'Hei Hva kan jeg hjelpe deg med?',
    },
    {
      author: 'Deg',
      message: 'Jeg trenger hjelp til å regne ut 1+1, jeg skjønner ikke!',
    },
    {
      author: 'Caroline',
      message: 'Dumme deg, det er 2!',
    },
  ] as IMessage[]);

  /*useEffect(() => { // TODO: Remember to uncomment this
    socket.on('message', message => {
      setMessages([
        ...messages,
        {
          author: message.author,
          message,
        },
      ]);
    });
  }, []);*/

  const send = message => {
    // socket.emit('message', message);
    console.log(message);
    setMessages([
      ...messages,
      {
        author: message.author,
        message: message.message,
      },
    ]);
  };

  return (
    <div className={'chat'}>
      <ChatBody messages={messages} send={send} />
    </div>
  );
};

export default Chat;
