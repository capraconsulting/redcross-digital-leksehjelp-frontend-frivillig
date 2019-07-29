import React from 'react';
import { IQuestionMeta } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';
import { dateStringFormat, studentGradeFormat } from '../services';

interface IProps {
  questionList: IQuestionMeta[];
  type: string;
}
const QuestionListComponent = (props: IProps & RouteComponentProps) => {
  const { questionList } = props;

  if (questionList.length < 1) {
    return <p>Denne listen er tom for øyeblikket</p>;
  }

  const { type, history } = props;

  return (
    <div className="question--list">
      {questionList.map(
        ({ id, subject, questionDate, studentGrade }, index) => (
          <div key={index} className="question--list-item">
            <h4>{subject}</h4>
            <p>Klasse: {studentGradeFormat(studentGrade)}</p>
            <p>Sendt inn: {dateStringFormat(questionDate)}</p>
            <div className="question--list-button-container">
              <button
                className="leksehjelp--button-success"
                onClick={() => history.push(`questions/${id}/${type}`)}
              >
                {' '}
                Se spørsmål
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default withRouter(QuestionListComponent);
