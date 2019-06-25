import React from 'react';
import { getQuestion, postAnswer } from '../services/api-service';
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
    const body = {
      questionId: id,
      answerText,
    };
    postAnswer(body, 'inbox').then(() => {
      setIsSaved(true); //TODO: handle isSaved message
    });
    event.preventDefault();
  };

  /*const onPreSave = setTimeout(() => {
    getQuestion(props.id).then(data => {
      console.log(data.answerText);
      console.log(question.answerText);
      if (data.answerText !== question.answerText) {
        console.log('Moeen');
        const body = { questionId: props.id, answerText };
        postAnswer(body, 'inbox').then(() => setIsSaved(true));
      }
    });
  }, 10000);*/

  const { questionText, title, answerText } = question;
  const { type } = props;
  return (
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
        <div className="question-form--button">
          <button onClick={e => onSend(e)}>
            {type === 'approval' ? 'Godkjenn' : 'Send til godkjenning'}
          </button>
          <button onClick={e => onSave(e)}>Lagre</button>
        </div>
      </div>
      <div className="question-answer--container">
        <h3>Tilbakemeldinger</h3>
      </div>
    </div>
  );
};

export default withRouter(AnswerQuestionContainer);
