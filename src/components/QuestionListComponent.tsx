import React from 'react';
import { IQuestionMeta } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';
import { dateFormat } from '../services/date-service';

interface IProps {
  questionList: IQuestionMeta[];
  type: string;
}
const QuestionListComponent = (props: IProps & RouteComponentProps) => {
  const { questionList } = props;

  if (questionList.length < 1) {
    return <p>Denne listen er tom for øyeblikket</p>;
  }

  return (
    <div className="question--list">
      {questionList.map(
        ({ id, subject, questionDate, studentGrade }, index) => (
          <div key={index} className="question--list-item">
            <h4>{subject}</h4>
            <p>Klasse: {studentGrade}</p>
            <p>Sendt inn: {dateFormat(questionDate)}</p>
            <div className="question--list-button">
              <button
                onClick={() =>
                  props.history.push({
                    pathname: `questions/${id}`,
                    state: { type: props.type },
                  })
                }
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
