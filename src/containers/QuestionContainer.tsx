import React from 'react';
import { getQuestionList } from '../services/api-service';
import { QuestionListComponent } from '../components';
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
    getQuestionList<IQuestionMeta[]>('started').then(setStartedQuestions);
    getQuestionList<IQuestionMeta[]>('approval').then(setAnsweredQuestions);
  }, []);

  return (
    <div>
      <div className="question--header">
        <h3>Spørsmål</h3>
      </div>
      <div className="question--container">
        <div className="question--container-inbox">
          <h5>Innboks</h5>
          <QuestionListComponent questionList={inboxQuestions} type="inbox" />
        </div>
        <div className="question--container-started">
          <h5>Påbegynt</h5>
          <QuestionListComponent
            questionList={startedQuestions}
            type="started"
          />
        </div>
        <div className="question--container-aproval">
          <h5>Til godkjenning</h5>
          <QuestionListComponent
            questionList={approvalQuestions}
            type="approval"
          />
        </div>
        <div className="question--container-feedback">
          <h5>Tilbakemeldinger</h5>
          <QuestionListComponent questionList={[]} type="feedback" />
        </div>
      </div>
    </div>
  );
};

export default QuestionContainer;
