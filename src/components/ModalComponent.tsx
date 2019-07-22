import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { publishQuestion } from '../services/api-service';

interface IProps {
  text: string;
  id?: string;
  isDelete?: boolean;
  isPublish?: boolean;
  isModalOpen(value: boolean);
}

const ModalComponent = (props: IProps & RouteComponentProps) => {
  const { isPublish, isDelete, isModalOpen, text, id, history } = props;
  const [modalText, setModalText] = useState<string>(text);
  const [isVisible, setIsVisible] = useState<boolean | undefined>(
    isPublish || isDelete,
  );

  const onPublishQuestion = event => {
    if (!id) return;
    publishQuestion(id)
      .then(() => {
        setModalText('Svaret er nå publisert!');
        setIsVisible(false);
      })
      .catch(() => {
        setIsVisible(false);
        setModalText('Noe gikk galt.');
      });
    setTimeout(() => history.goBack(), 3000);
    event.preventDefault();
  };

  const onAbort = event => {
    setIsVisible(false);
    setModalText(
      'Svaret er sendt til eleven, men ble ikke publisert på Digitalleksehjelp.no',
    );
    setTimeout(() => history.goBack(), 3000);
    event.preventDefault();
  };

  return (
    <div className={`modal`}>
      <p>{modalText}</p>
      <button
        className="leksehjelp--button-close"
        onClick={() => isModalOpen(false)}
      >
        x
      </button>
      {isVisible && (
        <div className="modal--button-container">
          <button
            className="leksehjelp--button-warning"
            onClick={e => onAbort(e)}
          >
            {isPublish ? 'Ikke publiser' : 'Slett'}
          </button>
          <button
            className="leksehjelp--button-success"
            onClick={e => onPublishQuestion(e)}
          >
            {isPublish ? 'Publiser svaret' : 'Avbryt'}
          </button>
        </div>
      )}
    </div>
  );
};

export default withRouter(ModalComponent);
