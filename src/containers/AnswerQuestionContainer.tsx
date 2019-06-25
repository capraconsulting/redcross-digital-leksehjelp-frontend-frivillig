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
    answer: '',
    studentGrade: '',
    questionDate: '',
    subject: '',
  });

  React.useEffect(() => {
    getQuestion(props.id).then(setQuestion);
  }, []);

  const onSend = event => {
    const { id, answer } = question;
    const body = {
      questionId: id,
      answerText: answer,
    };
    postAnswer(body, props.type).then(() => props.history.push('/'));
    event.preventDefault();
  };

  const { questionText, title, answer } = question;
  return (
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
            />
          </label>
          <label className="question-form--item">
            Spørsmål
            <textarea
              className="question-form--question"
              value={questionText}
              name="question"
            />
          </label>
          <label className="question-form--item">
            Svar
            <textarea
              className="question-form--answer"
              value={answer}
              name="answer"
              onChange={e =>
                setQuestion({ ...question, answer: e.target.value })
              }
            />
          </label>
          <div className="question-form--button">
            <button onClick={e => onSend(e)}>Send</button>
          </div>
        </form>
      </div>
      <div className="question-answer--container">
        <h3>Tilbakemeldinger</h3>
      </div>
    </div>
  );
};

export default withRouter(AnswerQuestionContainer);
