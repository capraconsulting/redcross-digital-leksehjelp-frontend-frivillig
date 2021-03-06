import React, { useEffect, useState, Fragment } from 'react';
import { IQuestion } from '../interfaces';
import { getQuestionList } from '../services';
import { AdminQuestionList } from '../components';

const AdminQuestionsContainer = () => {
  const [publicQuestionList, setPublicQuestionList] = useState(
    [] as IQuestion[],
  );

  const [unpublicQuestionList, setUnpublicQuestionList] = useState(
    [] as IQuestion[],
  );

  useEffect(() => {
    getQuestionList('public').then(setPublicQuestionList);
    getQuestionList('unpublished').then(setUnpublicQuestionList);
  }, []);

  return (
    <Fragment>
      <div className="side-margin">
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
            {unpublicQuestionList.length > 0 ? (
              <AdminQuestionList questionList={unpublicQuestionList} />
            ) : (
              <p>Det er ingen spørsmål som kan redigeres</p>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminQuestionsContainer;
