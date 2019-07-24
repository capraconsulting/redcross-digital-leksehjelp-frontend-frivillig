import React from 'react';
import {
  getQuestion,
  postAnswer,
  saveAnswer,
  getFeedbackList,
  deleteFeedback,
} from '../services/api-service';
import { IQuestion, IFeedback } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';

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
  });
  const [isSaved, setIsSaved] = React.useState<boolean>(false);
  const [modalText, setModalText] = React.useState('' as string);
  const [feedbackQuestions, setFeedbackQuestions] = React.useState(
    [] as IFeedback[],
  );

  React.useEffect(() => {
    getQuestion(props.id).then(setQuestion);
    getFeedbackList(props.id).then(setFeedbackQuestions);
  }, []);

  const onSend = event => {
    const { id, type, history } = props;
    const { answerText, title } = question;
    const data = {
      questionId: id,
      answerText,
      title,
      questionText
    };
    postAnswer(data, type).then(() => {
      setModalText(
        type === 'approval'
          ? 'Svaret er nå sendt til studenten.'
          : 'Svaret er sendt til godkjenning.',
      );
      setIsSaved(true);
      setTimeout(() => history.goBack(), 2000);
    }); //TODO: Handle error and response-message
    event.preventDefault();
  };

  const onSave = event => {
    const { id } = props;
    const { answerText, title } = question;
    const data = {
      questionId: id,
      answerText,
      title,
      questionText,
    };
    saveAnswer(data)
      .then(() => {
        setModalText('Svaret er nå lagret.');
        setIsSaved(true);
      })
      .catch(() => {
        setModalText('Noe gikk galt. Data ble ikke lagret.');
        setIsSaved(true);
      });
    event.preventDefault();
  };

  const onDeleteFeedback = (event, value: number) => {
    event.preventDefault();
    const id = value.toString();
    deleteFeedback(id)
      .then(() => {
        setModalText('Feedback er nå slettet.');
        setIsSaved(true);
        const feedbackList = feedbackQuestions.filter(({ id }) => id !== value);
        setFeedbackQuestions(feedbackList);
      })
      .catch(() => {
        setModalText('Noe gikk galt. Feedback ble ikke slettet.');
        setIsSaved(true);
      });
  };

  const { questionText, title, answerText } = question;
  const { type } = props;
  return (
    <div>
      <div className="question-answer">
        <div className="question-answer--container">
          <h3>Spørsmål og svar</h3>
          <form className="question-form">
            {type === 'approval' && (
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
            )}
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
            <div className="question-form--button">
              <button onClick={e => onSend(e)}>Godkjenn</button>
            </div>
          ) : (
            <div className="question-form--button">
              <button onClick={e => onSend(e)}>Send til godkjenning</button>
              <button onClick={e => onSave(e)}>Lagre</button>
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
      <div className={`modal--open-${isSaved}`}>
        <p>{modalText}</p>
        <button onClick={() => setIsSaved(false)}>x</button>
      </div>
    </div>
  );
};

export default withRouter(AnswerQuestionContainer);
