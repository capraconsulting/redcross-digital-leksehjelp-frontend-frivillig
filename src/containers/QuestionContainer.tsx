import React, { useEffect, useState } from 'react';
import { getQuestionList, getQuestion, getFeedbackList } from '../services';
import { QuestionListComponent, FeedbackListComponent } from '../components';
import { IFeedbackQuestion, IQuestion } from '../interfaces';

const QuestionContainer = () => {
  const [inboxQuestions, setInboxQuestions] = useState<IQuestion[]>([]);
  const [startedQuestions, setStartedQuestions] = useState<IQuestion[]>([]);
  const [approvalQuestions, setAnsweredQuestions] = useState<IQuestion[]>([]);
  const [feedbackQuestions, setFeedbackQuestions] = useState<
    IFeedbackQuestion[]
  >([]);
  const [apiFail, setApiFail] = useState<boolean>(false);

  const setFeedback = async () => {
    const feedbackList = await getFeedbackList().then(feedbackList => {
      return feedbackList.map(
        async feedback =>
          await getQuestion(feedback.id.toString()).then(question => {
            const { studentGrade, subject, questionDate } = question;

            return {
              ...feedback,
              studentGrade,
              questionDate,
              subject: feedback.subject,
            };
          }),
      );
    });

    Promise.all(feedbackList)
      .then(setFeedbackQuestions)
      .catch(() => setApiFail(true));
  };

  useEffect(() => {
    getQuestionList('inbox')
      .then(setInboxQuestions)
      .catch(() => setApiFail(true));
    getQuestionList('started')
      .then(setStartedQuestions)
      .catch(() => setApiFail(true));
    getQuestionList('approval')
      .then(setAnsweredQuestions)
      .catch(() => setApiFail(true));
    setFeedback();
  }, []);

  return (
    <div className="side-margin">
      <div className="container--header">
        <h3>Spørsmål</h3>
      </div>
      {!apiFail ? (
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
      ) : (
        <p>Noe gikk galt. Kontakt IT-avdelingen.</p>
      )}
    </div>
  );
};

export default QuestionContainer;
