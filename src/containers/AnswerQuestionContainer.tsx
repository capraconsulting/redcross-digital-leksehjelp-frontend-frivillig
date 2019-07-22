import React from 'react';
import {
  getQuestion,
  postAnswer,
  saveAnswer,
  getFeedbackList,
  deleteFeedback,
  publishQuestion,
} from '../services/api-service';
import { IQuestion, IFeedback } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';
import { Modal } from '../components';

interface IProps {
  id: string;
  type: string;
}

const AnswerQuestionContainer = (props: IProps & RouteComponentProps) => {
  const [question, setQuestion] = React.useState<IQuestion>({
    id: '',
    title: '',
    questionText: '',
    answerText: '',
    studentGrade: '',
    questionDate: '',
    subject: '',
    isPublic: false,
  });
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [hideModalButtons, setHideModalButtons] = React.useState<boolean>(
    false,
  );
  const [isPublish, setIsPublish] = React.useState<boolean>(false);
  const [modalText, setModalText] = React.useState('' as string);
  const [feedbackQuestions, setFeedbackQuestions] = React.useState(
    [] as IFeedback[],
  );

  React.useEffect(() => {
    getQuestion(props.id).then(setQuestion);
    getFeedbackList(props.id).then(setFeedbackQuestions);
  }, []);

  const createBody = () => {
    const { answerText, title, questionText } = question;
    const data = {
      questionId: props.id,
      answerText,
      title,
      questionText,
    };
    return data;
  };

  const onSend = async () => {
    const { type, history } = props;
    if (question.title === '') {
      setModalText('Du må oppdatere tittel før du kan sende dette spørsmålet');
      setModalVisible(true);
    } else {
      const data = createBody();
      const isSaved = await saveAnswer(data)
        .then(() => true)
        .catch(() => false);
      isSaved &&
        postAnswer(data, type)
          .then(() => {
            if (type === 'approval' && question.isPublic) {
              setModalText(
                'Svaret er sendt til eleven. Ønsker du å publisere spørsmålet på nettsiden?',
              );
              setIsPublish(true);
            } else if (type === 'approval' && !question.isPublic) {
              setModalText('Svaret er nå sendt til eleven.');
              setTimeout(() => history.goBack(), 2000);
            } else {
              setModalText('Svaret er sendt til godkjenning.');
              setTimeout(() => history.goBack(), 2000);
            }
            setModalVisible(true);
          })
          .catch(() => {
            setModalText('Noe gikk galt.');
            setModalVisible(true);
          });
    }
  };

  const onSave = event => {
    const data = createBody();
    saveAnswer(data)
      .then(() => {
        setModalText('Svaret er nå lagret.');
        setModalVisible(true);
      })
      .catch(() => {
        setModalText('Noe gikk galt. Data ble ikke lagret.');
        setModalVisible(true);
      });
    event.preventDefault();
  };

  const onDeleteFeedback = (event, value: number) => {
    event.preventDefault();
    const id = value.toString();
    deleteFeedback(id)
      .then(() => {
        setModalText('Feedback er nå slettet.');
        setModalVisible(true);
        const feedbackList = feedbackQuestions.filter(({ id }) => id !== value);
        setFeedbackQuestions(feedbackList);
      })
      .catch(() => {
        setModalText('Noe gikk galt. Feedback ble ikke slettet.');
        setModalVisible(true);
      });
  };

  const { questionText, title, answerText } = question;
  const { type, id } = props;

  const onPublishQuestion = event => {
    const { history } = props;
    if (!id) return;
    publishQuestion(id)
      .then(() => {
        setModalText('Svaret er nå publisert!');
        setHideModalButtons(true);
      })
      .catch(() => {
        setHideModalButtons(true);
        setModalText('Noe gikk galt.');
      });
    setTimeout(() => history.goBack(), 3000);
    event.preventDefault();
  };

  const onDontPublish = event => {
    const { history } = props;
    setHideModalButtons(true);
    setModalText(
      'Svaret er sendt til eleven, men ble ikke publisert på Digitalleksehjelp.no',
    );
    setTimeout(() => history.goBack(), 3000);
    event.preventDefault();
  };

  return (
    <div>
      {/*{
        modalVisible && <Modal text={modalText}  isPublish={isPublish} isModalOpen={setModalVisible} id={id}/>
      }*/}
      {modalVisible && (
        <Modal
          content={modalText}
          successButtonText={isPublish ? 'Publiser svaret' : 'Avbryt'}
          warningButtonText={isPublish ? 'Ikke publiser' : 'Slett'}
          successCallback={onPublishQuestion}
          warningCallback={onDontPublish}
          hideButtons={hideModalButtons}
          handleClose={() => setModalVisible(false)}
        />
      )}
      <div className="question-answer">
        <div className="question-answer--container">
          <h3>Spørsmål og svar</h3>
          <form className="question-form">
            <label className="question-form--item">
              Tittel
              <input
                className="question-form--input"
                value={title}
                type="text"
                name="title"
                onChange={e =>
                  setQuestion({ ...question, title: e.target.value })
                }
              />
            </label>
            <label className="question-form--item">
              Spørsmål
              <textarea
                className="question-form--question"
                value={questionText}
                name="question"
                onChange={e =>
                  setQuestion({ ...question, questionText: e.target.value })
                }
              />
            </label>
            <label className="question-form--item">
              Svar
              <textarea
                className="question-form--answer"
                value={answerText}
                name="answer"
                onChange={e =>
                  setQuestion({ ...question, answerText: e.target.value })
                }
              />
            </label>
          </form>
          {type === 'approval' ? (
            <div className="question-form--button-container">
              <button className="leksehjelp--button-success" onClick={onSend}>
                Godkjenn
              </button>
            </div>
          ) : (
            <div className="question-form--button-container">
              <button className="leksehjelp--button-success" onClick={onSend}>
                Godkjenning
              </button>
              <button className="leksehjelp--button-success" onClick={onSave}>
                Lagre
              </button>
            </div>
          )}
        </div>
        {feedbackQuestions.length > 0 && (
          <div className="question-answer--container">
            <h3>Tilbakemeldinger</h3>
            <div className="feedback--list">
              {feedbackQuestions.map(({ feedbackText, id }, index) => (
                <div className="feedback--list-row" key={index}>
                  <div className="feedback--list-element">
                    <p>{feedbackText}</p>
                  </div>
                  <div className="feedback--list-footer">
                    <button
                      className="leksehjelp--link-warning"
                      onClick={e => onDeleteFeedback(e, id)}
                    >
                      Slett
                    </button>
                    <a className="leksehjelp--link">Resolve</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(AnswerQuestionContainer);
