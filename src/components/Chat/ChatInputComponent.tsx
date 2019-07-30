import React, { useContext, useState } from 'react';
import { ISocketFile, IStudent, ITextMessage } from '../../interfaces';
import { createAvailableChatMessage, createJoinMessage, createTextMessage } from '../../services';
import { addMessageAction } from '../../reducers';
import { SocketContext } from '../../providers';
import { TextMessageBuilder } from '../../services';

interface IProps {
  uniqueID: string;
  roomID: string;
  student: IStudent;
  popUp(): any;
}

const ChatInputComponent = (props: IProps) => {
  const [message, setMessage] = useState<string>('');
  const { dispatchChats, socketSend, name} = useContext(SocketContext);
  const { uniqueID, roomID, student} = props;


  const onSendTextMessage = event => {
    event.preventDefault();
    if (message.length > 0) {
      const msg = new TextMessageBuilder(uniqueID)
        .withMessage(message)
        .toRoom(roomID)
        .build();
      const { textMessage, socketMessage } = msg.createMessage;
      setMessage('');
      socketSend(socketMessage);
      dispatchChats(addMessageAction(textMessage));
    }
  };

  const onAddUser = event => {
    event.preventDefault();
    let temp:ITextMessage = {
      author: '',
      roomID: '',
      uniqueID: '',
      message: '',
    };

    let lol:ITextMessage[] = [temp];

    const socketMessage = createJoinMessage(
      message,
      roomID,
      student,
      lol
    );

    socketSend(socketMessage);
  }

  const getAvailableChat = event => {
    event.preventDefault();
    const socketMessage = createAvailableChatMessage();
    socketSend(socketMessage);
    props.popUp();
  }

  const onFileUploadClick = () => {
    const fileInput = document.getElementById('msg-file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (

    <div className="message-form-container">
      <form className="message-form">
        <input
          type="file"
          name="attachment"
          id="msg-file-input"
          accept="image/*|.pdf|.doc|.docx"
          className="file"
        />
        <button type="button" className="upload" onClick={onFileUploadClick}>
          <img
            className="add-file-icon"
            src={require('../../assets/images/add-file.svg')}
            alt="Legg til fil"
          />
          <div className="tooltip">
            Hvis du sender et vedlegg, må du gjerne fjerne navnet ditt eller
            andre ting fra dokumentet som kan identifisere deg.
          </div>
        </button>
        <input
          className="message-text"
          type="textarea"
          value={message}
          onChange={event => setMessage(event.target.value)}
        />
        <button onClick={onSendTextMessage} className="send-message">
          <img
            className="send-icon"
            src={require('../../assets/images/send.svg')}
            alt="Send"
          />
        </button>
        <button className="leksehjelp--button-success" onClick={getAvailableChat}> Se alle tilgjengelige </button>
        <button className="leksehjelp--button-success" onClick={onAddUser}> Legg til bruker </button>
      </form>
    </div>
  );
};

export default ChatInputComponent;
