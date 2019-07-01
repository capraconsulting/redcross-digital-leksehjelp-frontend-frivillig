import React from 'react';
import {
  getQuestionList,
  getQuestion,
  getFeedbackList,
} from '../services/api-service';
import { QuestionListComponent, FeedbackListComponent } from '../components';
import { IQuestionMeta, IFeedbackQuestion } from '../interfaces';

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

  const [feedbackQuestions, setFeedbackQuestions] = React.useState(
    [] as IFeedbackQuestion[],
  );

  const setFeedback = async () => {
    const feedbackList = await getFeedbackList().then(feedbackList =>
      feedbackList.map(
        async feedback =>
          await getQuestion(feedback.questionID.toString()).then(question => {
            const { studentGrade, subject, questionDate } = question;
            return {
              ...feedback,
              studentGrade,
              subject,
              questionDate,
            };
          }),
      ),
    );
    Promise.all(feedbackList).then(setFeedbackQuestions);
  };

  React.useEffect(() => {
    getQuestionList<IQuestionMeta[]>('inbox').then(setInboxQuestions);
    getQuestionList<IQuestionMeta[]>('started').then(setStartedQuestions);
    getQuestionList<IQuestionMeta[]>('approval').then(setAnsweredQuestions);
    setFeedback();
  }, []);

  return (
    <div>
      <div className="container--header">
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
          <FeedbackListComponent feedbackList={feedbackQuestions} />
        </div>
      </div>
    </div>
  );
};

export default QuestionContainer;
