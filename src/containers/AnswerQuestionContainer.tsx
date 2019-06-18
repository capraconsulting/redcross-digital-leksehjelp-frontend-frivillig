import React from 'react';
import { get } from '../services/api-service';
import { IQuestion } from '../interfaces';

const AnswerQuestionContainer = ({ id }) => {
  const [questionObj, setQuestionObj] = React.useState({} as IQuestion);

  React.useEffect(() => {
    get(`questions${id}`).then(res => setQuestionObj(res[0]));
  }, []);

  console.log(questionObj);
  const { question, title, answer } = questionObj;
  return (
    <div className="question-answer">
      <div className="question-answer--container">
        <h3>Spørsmål og svar</h3>
        <form className="question-answer--container-form">
          <label>
            Tittel
            <input value={title} type="text" name="title" />
          </label>
          <label>
            Spørsmål
            <input value={question} type="text" name="question" />
          </label>
          <label>
            Svar
            <input value={answer} type="text" name="answer" />
          </label>
        </form>
      </div>
      <div className="question-answer--list">
        <h3>Tilbakemeldinger</h3>
      </div>
    </div>
  );
};

export default AnswerQuestionContainer;
