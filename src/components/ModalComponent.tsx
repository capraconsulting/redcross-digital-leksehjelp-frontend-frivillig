import React, {
  useState,
  MouseEvent,
  forwardRef,
  useImperativeHandle,
  RefObject,
} from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

interface IProps {
  content: string;
  successButtonText?: string;
  warningButtonText?: string;
  successCallback?(e: MouseEvent): void;
  warningCallback?(e: MouseEvent): void;
  handleClose(): void;
}

const ModalComponent = (props: IProps & RouteComponentProps) => {
  const {
    content,
    successButtonText,
    warningButtonText,
    successCallback,
    warningCallback,
    handleClose
  } = props;

  return (
    <div className="modal">
      <p>{content}</p>
      <button className="leksehjelp--button-close" onClick={handleClose}>
        x
      </button>
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
    </div>
  );
};

export default withRouter(ModalComponent);
