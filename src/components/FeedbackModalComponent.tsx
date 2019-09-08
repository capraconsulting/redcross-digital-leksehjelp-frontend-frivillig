import React, {
  FunctionComponent,
  MouseEvent,
  useContext,
  useState,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Cross from '../assets/Cross';
import { MixpanelEvents } from '../mixpanel-events';
import { SocketContext } from '../providers';

const POSSIBLE_REASONS = [
  'Tekniske problemer',
  'Eleven dukket ikke opp',
  'Vakten tok slutt før jeg rakk å hjelpe eleven',
  'For stor pågang',
  'Annet',
];

interface IProps {
  content: string;
  successButtonText?: string;
  warningButtonText?: string;
  successCallback?(helpResult: MixpanelEvents, props: object): void;
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
  const [helpSuccessful, setHelpSuccessful] = useState(true);
  const [descriptionNeeded, setDescriptionNeeded] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | undefined>(
    undefined,
  );
  const [description, setDescription] = useState<string | undefined>(undefined);
  const { chats, activeChatIndex } = useContext(SocketContext);

  const handleSuccess = () => {
    if (successCallback) {
      const { student } = chats[activeChatIndex];
      const props = {
        type: student.chatType,
        fag: student.subject,
        trinn: student.grade,
        tema: student.themes && student.themes.join(','),
      };

      if (helpSuccessful) {
        successCallback(MixpanelEvents.VOLUNTEER_HELP_SUCCESSFUL, props);
      } else {
        successCallback(MixpanelEvents.VOLUNTEER_HELP_FAILED, {
          ...props,
          årsak: selectedReason,
          beskrivelse: description,
        });
      }
    }
  };

  const handleReasonChanged = e => {
    setSelectedReason(e.target.value);
    setDescriptionNeeded(e.target.value === 'Annet');
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
            onClick={() => {
              setHelpSuccessful(true);
              setDescriptionNeeded(false);
            }}
          >
            Utført
          </button>
          <button
            className="leksehjelp--button--outline-success"
            onClick={() => setHelpSuccessful(false)}
          >
            Feilet
          </button>
        </div>
        {!helpSuccessful && (
          <form className="leksehjelp--feedback--reasons--container">
            <div>
              {POSSIBLE_REASONS.map(reason => (
                <div key={reason}>
                  <input
                    type="radio"
                    name="helpFailedReasons"
                    value={reason}
                    onClick={handleReasonChanged}
                  />
                  <label>{reason}</label>
                </div>
              ))}
            </div>
            {descriptionNeeded && (
              <>
                <textarea
                  className="leksehjelp--feedback--reasons-textarea"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Beskriv hvorfor leksehjelpen ikke ble utført."
                />
              </>
            )}
          </form>
        )}
        <div className="button-container leksehjelp--feedback--schema--buttons">
          {!hideButtons && (
            <div className="modal--button-container">
              {successButtonText && (
                <button
                  onClick={handleSuccess}
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
