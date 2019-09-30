import React, { useContext, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  createGetAvailableQueueMessage,
  createVolunteerMessage,
  getTimeStringNow,
  getVolunteer,
  JoinChatMessageBuilder,
  TextMessageBuilder,
  uploadFileToAzureBlobStorage,
} from '../../services';
import { IFile, ITempFile, IVolunteer } from '../../interfaces';
import { addMessageAction } from '../../reducers';
import { SocketContext } from '../../providers';
import { IconButton, Modal } from '../';
import '../../styles/chat-input-component.less';
import DeleteIcon from '@material-ui/icons/Delete';

interface IProps {
  roomID: string;
}

const ChatInputComponent = (props: IProps) => {
  const [message, setMessage] = useState<string>('');
  const {
    dispatchChats,
    socketSend,
    volunteerInfo,
    availableVolunteers,
    activeChatIndex,
    chats,
    uniqueID,
    setAvailableVolunteers,
  } = useContext(SocketContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { roomID } = props;
  const [tempFiles, setTempFiles] = useState([] as any[]);
  const { name, imgUrl } = volunteerInfo;

  const uploadPromises = tempFiles => {
    return tempFiles.map(async file => {
      return uploadFileToAzureBlobStorage('chatfiles', roomID, file);
    });
  };

  const frivilligOptionsCallback = (volunteer: IVolunteer): void => {
    //setAvailableVolunteers(availableVolunteers.filter(vol => vol !== volunteer));
    chats[activeChatIndex].volunteerCount += 1;
    socketSend(createGetAvailableQueueMessage(roomID));
    socketSend(
      new JoinChatMessageBuilder()
        .withRoomID(chats[activeChatIndex].roomID)
        .withChatHistory(chats[activeChatIndex].messages)
        .withStudentInfo(chats[activeChatIndex].student)
        .withUniqueID(volunteer.chatID)
        .withVolName(volunteer.name)
        .build()
        .createMessage(),
    );
  };

  const createFrivilligOptions = () => {
    return availableVolunteers.map(volunteer => {
      console.log(volunteer.name);
      return {
        inputText: volunteer.name,
        buttonText: 'Legg til',
        callback: () => frivilligOptionsCallback(volunteer),
        isDisabled: true,
      };
    });
  };

  // Sends text message with message and succesfully uploaded files (IFiles)
  const sendTextMessage = (event, files) => {
    event.preventDefault();
    if (message.length > 0 || files.length > 0) {
      const msg = new TextMessageBuilder(uniqueID)
        .withAuthor(name)
        .withImg(imgUrl)
        .withMessage(message)
        .withFiles(files)
        .toRoom(roomID)
        .build();
      const { textMessage, socketMessage } = msg.createMessage;
      dispatchChats(
        addMessageAction({
          ...textMessage,
          datetime: getTimeStringNow(),
        }),
      );
      socketSend(socketMessage);
      setMessage('');
      setTempFiles([] as any[]);
    }
  };

  //Returns promises that resolves upon successfull file upload. Then sends message with messagetext and files.
  const handleSubmit = event => {
    event.preventDefault();
    return Promise.all<IFile>(uploadPromises(tempFiles)).then(results => {
      sendTextMessage(event, results);
    });
  };

  const openFileDialog = () => {
    const ref = document.getElementById('file-dialog');
    ref && ref.click();
  };

  //Callback handling file drop in DropZone.
  const onDrop = useCallback(
    acceptedFiles => {
      setTempFiles([...tempFiles, ...acceptedFiles]);
    },
    [tempFiles],
  );
  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  //Renders temporary file attachments ready to send
  const FileList = () => {
    if (window.event) {
      window.event.preventDefault();
    }
    return (
      <ul className="filelist">
        {tempFiles.map((file, index) => {
          const { name } = file;
          return (
            <li key={index}>
              <span>
                <a
                  className="filelist-ankertag"
                  href={URL.createObjectURL(file)}
                  title={name}
                  download={name}
                >
                  {name}{' '}
                </a>
                <IconButton
                  onClick={() => {
                    setTempFiles(tempFiles.filter((_, i) => i !== index));
                  }}
                  icon={<DeleteIcon />}
                />{' '}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <div className={'message-form-container'}>
        <form className={'message-form'}>
          <input
            onChange={event => {
              let { files } = event.target;
              let newFiles = [] as any;
              let steps = (files && files.length) || 0;
              for (var i = 0; i < steps; i++) {
                let item = (files && files.item(i)) || 'null';
                newFiles.push(item);
              }
              files && setTempFiles([...tempFiles, ...newFiles]);
            }}
            type="file"
            name="attachment"
            id="msg-file-input"
            accept="image/*|.pdf|.doc|.docx|.csv"
            className="file"
          />
          <button
            type="button"
            className="upload"
            onClick={() => openFileDialog()}
          >
            <input
              type="file"
              id="file-dialog"
              className="input-file"
              accept="image/*|.pdf|.doc|.docx|.csv"
              onChange={event => {
                let { files } = event.target;
                let newFiles = [] as any;
                let steps = (files && files.length) || 0;
                for (var i = 0; i < steps; i++) {
                  let item = (files && files.item(i)) || 'null';
                  newFiles.push(item);
                }
                files && setTempFiles([...tempFiles, ...newFiles]);
              }}
            />
            <span className="plus">+</span>
            <div className="tooltip">
              Hvis du sender et vedlegg, må du gjerne fjerne navnet ditt eller
              andre ting fra dokumentet som kan identifisere deg.
            </div>
          </button>
          <input
            id={'message-text-input'}
            className={'message-text'}
            type="textarea"
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
          <button
            onClick={event => handleSubmit(event)}
            className={'send-message'}
          >
            <svg width="30px" height="30px" viewBox="0 0 30 30">
              <polygon className="arrow" points="30 15 0 30 5.5 15 0 0" />
            </svg>
          </button>
          <button
            className="leksehjelp--button-success no-margin"
            onClick={event => {
              event.preventDefault();
              socketSend(createGetAvailableQueueMessage(roomID));
              // Wait for response
              /*
               * Thought process:
               * It's better to wait 500ms than to send out a list of
               * Available frivillige every time someone connects
               */
              setTimeout(() => setModalOpen(true), 500);
            }}
          >
            Se tilgjengelige
          </button>
        </form>
        <FileList />
      </div>

      {modalOpen && (
        <Modal
          content="Tilgjengelige frivillige"
          inputFields={createFrivilligOptions()}
          closingCallback={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInputComponent;
