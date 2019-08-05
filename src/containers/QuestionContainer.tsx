import React, { useEffect, useState } from 'react';
import {
  getQuestionList,
  getQuestion,
  getFeedbackList,
} from '../services/api-service';
import { QuestionListComponent, FeedbackListComponent } from '../components';
import { IQuestionMeta, IFeedbackQuestion } from '../interfaces';

const QuestionContainer = () => {
  const [inboxQuestions, setInboxQuestions] = useState<IQuestionMeta[]>([]);
  const [startedQuestions, setStartedQuestions] = useState<IQuestionMeta[]>([]);
  const [approvalQuestions, setAnsweredQuestions] = useState<IQuestionMeta[]>(
    [],
  );
  const [feedbackQuestions, setFeedbackQuestions] = useState<
    IFeedbackQuestion[]
  >([]);
  const [apiFail, setApiFail] = useState<boolean>(false);

  const setFeedback = async () => {
    const feedbackList = await getFeedbackList().then(feedbackList =>
      feedbackList.map(
        async feedback =>
          await getQuestion(feedback.id.toString()).then(question => {
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

    Promise.all(feedbackList)
      .then(setFeedbackQuestions)
      .catch(() => setApiFail(true));
  };

  useEffect(() => {
    getQuestionList<IQuestionMeta[]>('inbox')
      .then(setInboxQuestions)
      .catch(() => setApiFail(true));
    getQuestionList<IQuestionMeta[]>('started')
      .then(setStartedQuestions)
      .catch(() => setApiFail(true));
    getQuestionList<IQuestionMeta[]>('approval')
      .then(setAnsweredQuestions)
      .catch(() => setApiFail(true));
    setFeedback();
  }, []);

  return (
    <div>
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
          <p>Noe gikk galt. Kontakt it-avdelingen.</p>
        )}
    </div>
  );
};

export default QuestionContainer;
