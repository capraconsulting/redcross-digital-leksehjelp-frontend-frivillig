import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IQuestion } from '../interfaces';
import { getQuestionList } from '../services/api-service';
import { dateStringFormat } from '../services/date-service';

const GRADES = [
  { gradeID: '8', label: '8. klasse' },
  { gradeID: '9', label: '9. klasse' },
  { gradeID: '10', label: '10. klasse' },
  { gradeID: '11', label: 'Vg 1' },
  { gradeID: '12', label: 'Vg 2' },
  { gradeID: '13', label: 'Vg 3' },
];

Object.freeze(GRADES);

const AdminQuestionsContainer = () => {
  const [publicQuestionList, setPublicQuestionList] = useState(
    [] as IQuestion[],
  );

  useEffect(() => {
    getQuestionList<IQuestion[]>('public').then(setPublicQuestionList);
  }, []);

  const studentGradeFormat = (studentGrade: string): string => {
    return GRADES.filter(({ gradeID }) => gradeID === studentGrade).map(
      ({ label }) => label,
    )[0];
  };

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
