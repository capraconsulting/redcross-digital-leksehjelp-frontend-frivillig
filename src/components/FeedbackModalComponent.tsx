import React, { FunctionComponent, MouseEvent, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Cross from '../assets/Cross';

interface IProps {
  content: string;
  successButtonText?: string;
  warningButtonText?: string;
  successCallback?(e: MouseEvent): void;
  warningCallback?(e: MouseEvent): void;
  hideButtons?: boolean;
  closingCallback(): void;
}

const FeedbackModalComponent: FunctionComponent<
  IProps & RouteComponentProps
> = ({
  content,
  successButtonText,
  warningButtonText,
  successCallback,
  warningCallback,
  hideButtons,
  closingCallback,
}) => {
  const [helpSuccessful, setHelpSuccessful] = useState<boolean>(true);
  const [descriptionNeeded, setDescriptionNeeded] = useState<boolean>(false);

  const reasons = [
    'Tekniske problemer',
    'Eleven dukket ikke opp',
    'Vakten tok slutt før jeg rakk å hjelpe eleven',
    'For stor pågang',
    'Annet',
  ];

  const handleValueChanged = e => {
    if (e.target.value == 'Annet') {
      setDescriptionNeeded(true);
    } else {
      setDescriptionNeeded(false);
    }
  };

  const handleHelpOutcome = e => {
    if (e.target.value == 'success') {
      setHelpSuccessful(true);
    } else {
      setHelpSuccessful(false);
    }
  };

  return (
    <div className="modal-container">
      <div className="backdrop" onClick={closingCallback} />
      <div className="modal leksehjelp--feedback--schema">
        <button
          className="modal--close leksehjelp--button-close"
          onClick={closingCallback}
        >
          <Cross color="black" />
        </button>
        <h2 className="content-text">{content}</h2>
        <p>Ble leksehjelpen utført?</p>
        <div className="leksehjelp--button--schema">
          <button
            className="leksehjelp--button--outline-success"
            value="success"
            onClick={handleHelpOutcome}
          >
            Utført
          </button>
          <button
            className="leksehjelp--button--outline-success"
            value="failed"
            onClick={handleHelpOutcome}
          >
            Feilet
          </button>
        </div>
        {!helpSuccessful && (
          <form>
            <div style={{ display: 'block' }}>
              {reasons.map(reason => (
                <div key={reason}>
                  <input
                    type="radio"
                    name="helpFailedReasons"
                    value={reason}
                    onClick={handleValueChanged}
                  ></input>
                  <label>{reason}</label>
                </div>
              ))}
            </div>
            {descriptionNeeded && (
              <form>
                <label>Begrunnelse</label>
                <input className="question-form--input" type="text"></input>
              </form>
            )}
          </form>
        )}
        <div className="button-container leksehjelp--feedback--schema--buttons">
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

export default withRouter(FeedbackModalComponent);
