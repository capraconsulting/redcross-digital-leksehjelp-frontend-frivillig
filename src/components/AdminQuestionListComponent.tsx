import React from 'react';
import { Link } from 'react-router-dom';
import { IQuestion } from '../interfaces';
import { studentGradeFormat, dateStringFormat } from '../services';

interface IProps {
  questionList: IQuestion[];
}
const AdminQuestionListComponent = (props: IProps) => {
  const { questionList } = props;
  console.log(questionList);

  return (
    <div className="admin-questions--list">
      {questionList.map((question, index) => {
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
                to={`/questions/${id}/approval`}
              >
                Vis
              </Link>
              <Link
                className="leksehjelp--link"
                to={`/questions/${id}/started`}
              >
                Rediger
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminQuestionListComponent;
