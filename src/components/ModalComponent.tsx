import React, { MouseEvent, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

interface IProps {
  content: string;
  successButtonText?: string;
  warningButtonText?: string;
  successCallback?(e: MouseEvent): void;
  warningCallback?(e: MouseEvent): void;
  handleClose(): void;
  hideButtons?: boolean;
  inputFields?: {
    inputText: string;
    buttonText: string;
    cb(): void;
  }[];
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
    inputFields,
  } = props;

  const createInputFields = () => {
    if (inputFields) {
      return inputFields.map((inputField, index) => {
        return (
          <div className="input-field" key={index}>
            <input
              className="text"
              type="text"
              defaultValue={inputField.inputText}
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

  return (
    <div className="modal-container">
      <div className="backdrop" />
      <div className="modal">
        <div className="x-container">
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
};

export default withRouter(ModalComponent);
