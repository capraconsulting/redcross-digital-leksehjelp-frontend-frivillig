import React from 'react';
import { get } from '../services/api-service';
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
    get('questions?answered=true').then(setAnsweredQuestions);
    get('questions?answered=false').then(setUnansweredQuestions);
  }, []);

  return (
    <div>
      <div className="question--header">
        <h3>Spørsmål</h3>
      </div>
      <h3>Spørsmål som kan besvares</h3>
      {answeredQuestions.length > 0 ? (
        <div className="question--list">
          {answeredQuestions.map((res, id) => (
            <QuestionComponent key={id} questionObj={res} />
          ))}
        </div>
      ) : (
        <p>Det er ingen nye spørsmål som kan besvares</p>
      )}
      <h3>Besvarte spørsmål</h3>
      {unansweredQuestions.length > 0 ? (
        <div className="question--list">
          {unansweredQuestions.map((res, id) => (
            <QuestionComponent key={id} questionObj={res} />
          ))}
        </div>
      ) : (
        <p>Det finnes ingen spørsmål som er besvart</p>
      )}
    </div>
  );
};

export default QuestionContainer;
