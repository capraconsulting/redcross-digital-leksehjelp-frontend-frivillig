import React, { MouseEvent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { IChat, IStudent, ITextMessage } from '../interfaces';
import { createJoinMessage } from '../services';
import { SocketContext } from '../providers';

interface IProps {
  content: string;
  successButtonText?: string;
  warningButtonText?: string;
  successCallback?(e: MouseEvent): void;
  warningCallback?(e: MouseEvent): void;
  handleClose(): void;
  hideButtons?: boolean;
  volunteers?: string[];
  roomID?: string;
  student?: IStudent;
  messages?: ITextMessage[];
}

const ModalComponent = (props: IProps & RouteComponentProps) => {

  const {socketSend} = useContext(SocketContext);

  const {
    content,
    successButtonText,
    warningButtonText,
    successCallback,
    warningCallback,
    handleClose,
    hideButtons,
    volunteers,
    roomID,
    student
  } = props;

  const selectUser = (name) => {

    const socketMessage = createJoinMessage(
      name,
      props.roomID!,
      props.student!,
      props.messages!,
    );

    socketSend(socketMessage);
    handleClose();
  }

  const mapAvailable = () => {
    console.log("Meldinger sendt");
  if (props.volunteers !== undefined) {
    return props.volunteers.map((name, message) => (
      <div className={"available-volunteers"} key={name}>
        <p>{name}</p>
        <div className={"modal--button-container"}>
          <button className={"modal-button-success"}onClick={() => selectUser(name)}>Select</button>
        </div>
      </div>
      ))
    }
  };

  return (
    <div className="modal">
      <p>{content}</p>
      {mapAvailable()}
      {!hideButtons && (
        <div className="modal--button-container">
          {successButtonText && (
            <button
              onClick={successCallback}
              className="leksehjelp--button-success"
            >
              {successButtonText}
            </button>
          )}
          {warningButtonText && (
            <button
              onClick={warningCallback}
              className="leksehjelp--button-warning"
            >
              {warningButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default withRouter(ModalComponent);
