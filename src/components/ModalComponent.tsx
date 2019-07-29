import React, { MouseEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Cross from '../assets/Cross';

interface IProps {
  content: string;
  successButtonText?: string;
  warningButtonText?: string;
  successCallback?(e: MouseEvent): void;
  warningCallback?(e: MouseEvent): void;
  handleClose(): void;
  hideButtons?: boolean;
}

const ModalComponent = (props: IProps & RouteComponentProps) => {
  const {
    content,
    successButtonText,
    warningButtonText,
    successCallback,
    warningCallback,
    handleClose,
    hideButtons,
  } = props;

  return (
    <div className="modal">
      <p>{content}</p>
      <button
        className="modal--close leksehjelp--button-close"
        onClick={handleClose}
      >
        <Cross color="black" />
      </button>
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
