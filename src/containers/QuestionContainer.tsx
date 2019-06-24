import React from 'react';
import { getQuestionList } from '../services/api-service';
import { QuestionComponent } from '../components';
import { IQuestionMeta } from '../interfaces';

const QuestionContainer = () => {
  const [inboxQuestions, setInboxQuestions] = React.useState(
    [] as IQuestionMeta[],
  );

  const [startedQuestions, setStartedQuestions] = React.useState(
    [] as IQuestionMeta[],
  );

  const [approvalQuestions, setAnsweredQuestions] = React.useState(
    [] as IQuestionMeta[],
  );

  React.useEffect(() => {
    getQuestionList<IQuestionMeta[]>('inbox').then(setInboxQuestions);
    getQuestionList('started').then(setStartedQuestions);
    getQuestionList('approval').then(setAnsweredQuestions);
  }, []);

  return (
    <div>
      <div className="question--header">
        <h3>Spørsmål</h3>
      </div>
      <div className="question--container">
        <div className="question--container-inbox">
          <h5>Innboks</h5>
          <QuestionComponent questionList={inboxQuestions} />
        </div>
        <div className="question--container-started">
          <h5>Påbegynt</h5>
          <QuestionComponent questionList={startedQuestions} />
        </div>
        <div className="question--container-aproval">
          <h5>Til godkjenning</h5>
          <QuestionComponent questionList={approvalQuestions} />
        </div>
        <div className="question--container-feedback">
          <h5>Tilbakemeldinger</h5>
          <QuestionComponent questionList={[]} />
        </div>
      </div>
    </div>
  );
};

export default QuestionContainer;
