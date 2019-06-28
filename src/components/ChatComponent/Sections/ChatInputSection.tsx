import React, { useState } from 'react';
import { createTextMessage } from '../../../services/message-service';
import { ISocketFile, ISocketMessage } from '../../../interfaces';

interface IProps {
  uniqueID: string;
  roomID: string;
  onSend(message: ISocketMessage): void;
}

const ChatInputSection = (props: IProps) => {
  const [message, setMessage] = useState('' as string);

  const onSendTextMessage = event => {
    event.preventDefault();
    if (message.length > 0) {
      const msg: ISocketMessage = createTextMessage(
        message,
        props.uniqueID,
        props.roomID,
      );
      setMessage('');
      props.onSend(msg);
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
    console.log(file);
    fr.onload = () => {
      const socketFile: ISocketFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        dataURL: String(fr.result),
      };
      const msg: ISocketMessage = createTextMessage(
        socketFile,
        props.uniqueID,
        props.roomID,
      );
      props.onSend(msg);
    };
    fr.readAsDataURL(file);
  };

  return (
    <div className={'message-form-container'}>
      <form className={'message-form'}>
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
          onClick={() => onFileUploadClick()}
        >
          {/*<span className="plus">+</span>*/}
          <img
            className="add-file-icon"
            src={require('../../../assets/images/add-file.svg')}
            alt="Legg til fil"
          />
          <div className="tooltip">
            Hvis du sender et vedlegg, må du gjerne fjerne navnet ditt eller
            andre ting fra dokumentet som kan identifisere deg.
          </div>
        </button>
        <input
          className={'message-text'}
          type="textarea"
          value={message}
          onChange={event => setMessage(event.target.value)}
        />
        <button
          onClick={event => onSendTextMessage(event)}
          className={'send-message'}
        >
          <img
            className="send-icon"
            src={require('../../../assets/images/send.svg')}
            alt="Send"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatInputSection;
