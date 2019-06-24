import React from 'react';
import { getQuestionList } from '../services/api-service';
import { QuestionComponent } from '../components';
import { IQuestion } from '../interfaces/IQuestion';

const QuestionContainer = () => {
  const [answeredQuestions, setAnsweredQuestions] = React.useState(
    [] as IQuestion[],
  );
  const [unansweredQuestions, setUnansweredQuestions] = React.useState(
    [] as IQuestion[],
  );

  React.useEffect(() => {
    getQuestionList(true).then(setAnsweredQuestions);
    getQuestionList(false).then(setUnansweredQuestions);
  }, []);

  return (
    <div>
      <div className="question--header">
        <h3>Spørsmål</h3>
      </div>
      <div className="question--container">
        <div className="question--container-inbox">
          <h5>Innboks</h5>
          <QuestionComponent questionList={unansweredQuestions} />
        </div>
        <div className="question--container-started">
          <h5>Påbegynt</h5>
          <QuestionComponent questionList={answeredQuestions} />
        </div>
        <div className="question--container-aproval">
          <h5>Til godkjenning</h5>
          <QuestionComponent questionList={answeredQuestions} />
        </div>
        <div className="question--container-feedback">
          <h5>Tilbakemeldinger</h5>
          <QuestionComponent questionList={answeredQuestions} />
        </div>
      </div>
    </div>
  );
};

export default QuestionContainer;
