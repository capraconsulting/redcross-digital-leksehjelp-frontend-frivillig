import React from 'react';
import { getQuestion, postAnswer, saveAnswer } from '../services/api-service';
import { IQuestion } from '../interfaces';
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
  const [isSaved, setIsSaved] = React.useState(false as boolean);

  React.useEffect(() => {
    getQuestion(props.id).then(setQuestion);
  }, []);

  const onSend = event => {
    postAnswer({ questionId: props.id, answerText }, props.type).then(() =>
      props.history.goBack(),
    ); //TODO: Handle error and response-message
    event.preventDefault();
  };

  const onSave = event => {
    const { id, answerText } = question;
    const data = {
      questionId: id,
      answerText,
    };
    saveAnswer(data).then(() => {
      setIsSaved(true); //TODO: handle isSaved message
    });
    event.preventDefault();
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
        <div className="question-answer--container">
          <h3>Andre spørsmål du kan besvare</h3>
        </div>
      </div>
      <div className={`modal--open-${isSaved}`}>
        <p>Svaret er nå lagret.</p>
        <button onClick={() => setIsSaved(false)}>x</button>
      </div>
    </div>
  );
};

export default withRouter(AnswerQuestionContainer);
