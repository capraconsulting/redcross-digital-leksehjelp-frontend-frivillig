/*
import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');

// TEMPORARY VALUES FOR STUDENT AND TEACHER WHILE TESTING
const roomID = '1';

export const ChatSocket = () => {
  const [message, setMessage] = useState('' as string);
  const [recvMessage, setRecvMessage] = useState('' as string);

  useEffect(() => {
    socket.on(`message`, message => {
      console.log(message);
      setRecvMessage(message);
    });
  }, []);

  const send = () => {
    socket.emit('message', message, roomID);
    setMessage('');
  };

  const connect = () => {
    socket.emit('join room', roomID);
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={event => setMessage(event.target.value)}
      />
      <button onClick={send}>Send</button>
      <button onClick={() => connect()}>Connect</button>
    </div>
  );
};
*/
