import React, { useState } from 'react';
import { createTextMessage } from '../../services/message-service';
import { ISocketFile, ISocketMessage } from '../../interfaces';

const addFileIcon = require('../../assets/images/add-file.svg');
const sendIcon = require('../../assets/images/send.svg');

interface IProps {
  uniqueID: string;
  roomID: string;
  onSend(message: ISocketMessage): void;
}

const ChatInputComponent = (props: IProps) => {
  const [message, setMessage] = useState<string>('');
  const {uniqueID, roomID, onSend} = props;

  const onSendTextMessage = event => {
    event.preventDefault();
    if (message.length > 0) {
      const socketMessage: ISocketMessage = createTextMessage(
        message,
        uniqueID,
        roomID,
      );
      setMessage('');
      onSend(socketMessage);
    }
  };

  const onFileUploadClick = () => {
    const fileInput = document.getElementById('msg-file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const onSendFileMessage = (file: File) => {
    const fr = new FileReader();
    fr.onload = () => {
      const socketFile: ISocketFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        dataURL: String(fr.result),
      };
      const socketMessage: ISocketMessage = createTextMessage(
        socketFile,
        uniqueID,
        roomID,
      );
      onSend(socketMessage);
    };
    fr.readAsDataURL(file);
  };

  return (
    <div className="message-form-container">
      <form className="message-form">
        <input
          onChange={event =>
            event.target.files && onSendFileMessage(event.target.files[0])
          }
          type="file"
          name="attachment"
          id="msg-file-input"
          accept="image/*|.pdf|.doc|.docx"
          className="file"
        />
        <button
          type="button"
          className="upload"
          onClick={onFileUploadClick}
        >
          <img
            className="add-file-icon"
            src={addFileIcon}
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
        <button
          onClick={onSendTextMessage}
          className="send-message"
        >
          <img
            className="send-icon"
            src={sendIcon}
            alt="Send"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatInputComponent;
