import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ModalContext } from '../providers/ModalProvider';

interface IProps {
  content: string;
  successButtonText?: string;
  warningButtonText?: string;
  successCallback?(e: MouseEvent): void;
  warningCallback?(e: MouseEvent): void;
  hideButtons?: boolean;
  inputFields?: {
    inputText: string;
    buttonText: string;
    cb(): void;
    isDisabled?: boolean;
  }[];
}

const ModalComponent = (props: IProps & RouteComponentProps) => {
  const {
    content,
    successButtonText,
    warningButtonText,
    successCallback,
    warningCallback,
    hideButtons,
    inputFields,
  } = props;
  const {isOpen, setIsOpen} = useContext(ModalContext);

  const createInputFields = () => {
    if (inputFields) {
      return inputFields.map((inputField, index) => {
        return (
          <div className="input-field" key={index}>
            <input
              className="text"
              type="text"
              defaultValue={inputField.inputText}
              disabled={inputField.isDisabled}
            />
            <button
              onClick={() => inputField.cb()}
              className="button leksehjelp--button-success"
            >
              {inputField.buttonText}
            </button>
          </div>
        );
      });
    }
  };

  if (!isOpen) {
    return null;
  } else {
    return (
      <div className="modal-container">
        <div className="backdrop" onClick={() => setIsOpen(false)} />
        <div className="modal">
          <div className="x-container" onClick={() => setIsOpen(false)}>
            <div className="x t medium">
              <b></b>
              <b></b>
              <b></b>
              <b></b>
            </div>
          </div>
          <p className="content-text">{content}</p>
          <div className="input-field-container">{createInputFields()}</div>
          <div className="button-container">
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
        </div>
      </div>
    );
  }
};

export default withRouter(ModalComponent);
