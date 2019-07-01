import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IQuestion } from '../interfaces';
import {
  getQuestionList,
  dateStringFormat,
  studentGradeFormat,
} from '../services';

const AdminQuestionsContainer = () => {
  const [publicQuestionList, setPublicQuestionList] = useState(
    [] as IQuestion[],
  );

  useEffect(() => {
    getQuestionList<IQuestion[]>('public').then(setPublicQuestionList);
  }, []);

  return (
    <div>
      <div className="container--header">
        <h3>Alle godkjente spørsmål</h3>
      </div>
      <div className="admin-questions">
        <div className="admin-questions--item">
          <h5>Publisert</h5>
          <div className="admin-questions--list">
            {publicQuestionList.length > 0 ? (
              publicQuestionList.map((question, index) => {
                const { subject, studentGrade, questionDate, id } = question;
                return (
                  <div key={index} className="admin-questions--list-item">
                    <div className="item-header">
                      <h4>{subject}</h4>
                      <p>{studentGradeFormat(studentGrade)}</p>
                    </div>
                    <div className="item-row">
                      <p>Sendt inn:</p> {dateStringFormat(questionDate)}
                    </div>
                    <div className="item-footer">
                      <Link
                        className="leksehjelp--link"
                        to={`/questions/${id}/edit`}
                      >
                        Vis
                      </Link>
                      <Link
                        className="leksehjelp--link"
                        to={`/questions/${id}/edit`}
                      >
                        Rediger
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Det er ingen spørsmål som kan redigeres</p>
            )}
          </div>
        </div>
        <div className="admin-questions--item">
          <h5>Ikke Publisert</h5>
          <div className="admin-questions--list">
            <p>Det er ingen spørsmål som kan redigeres</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestionsContainer;
