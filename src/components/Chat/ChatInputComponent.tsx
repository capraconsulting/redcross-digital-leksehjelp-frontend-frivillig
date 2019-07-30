import React, { useContext, useState } from 'react';
import { ISocketFile, IStudent, ITextMessage } from '../../interfaces';
import { addMessageAction } from '../../reducers';
import { ModalContext, SocketContext } from '../../providers';
import { createGetAvailableQueueMessage, TextMessageBuilder } from '../../services';

interface IProps {
  uniqueID: string;
  roomID: string;
}

const ChatInputComponent = (props: IProps) => {
  const [message, setMessage] = useState<string>('');
  const { dispatchChats, socketSend, name } = useContext(SocketContext);
  const { setIsOpen } = useContext(ModalContext);
  const { uniqueID, roomID } = props;

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
        <button
          className="leksehjelp--button-success"
          onClick={(e) => {
            e.preventDefault();
            const msg = createGetAvailableQueueMessage();
            socketSend(msg);
            setIsOpen(true);
          }}
        >
          Se alle tilgjengelige
        </button>
      </form>
    </div>
  );
};

export default ChatInputComponent;
