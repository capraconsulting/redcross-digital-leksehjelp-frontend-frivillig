import React, { useEffect, useState, Fragment } from 'react';
import { IQuestion } from '../interfaces';
import { getQuestionList } from '../services';
import { AdminQuestionList } from '../components';

const AdminQuestionsContainer = () => {
  const [publicQuestionList, setPublicQuestionList] = useState(
    [] as IQuestion[],
  );

  useEffect(() => {
    getQuestionList<IQuestion[]>('public').then(setPublicQuestionList);
  }, []);

  return (
    <Fragment>
      <div className="container--header">
        <h3>Alle godkjente spørsmål</h3>
      </div>
      <div className="admin-questions">
        <div className="admin-questions--item">
          <h5>Publisert</h5>
          {publicQuestionList.length > 0 ? (
            <AdminQuestionList questionList={publicQuestionList} />
          ) : (
            <p>Det er ingen spørsmål som kan redigeres</p>
          )}
        </div>
        <div className="admin-questions--item">
          <h5>Ikke Publisert</h5>
          <div className="admin-questions--list">
            <p>Det er ingen spørsmål som kan redigeres</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminQuestionsContainer;
