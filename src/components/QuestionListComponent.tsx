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

  const getButtonText = (type: string) => {
    switch (type) {
      case 'inbox':
        return 'Se spørsmål';
        break;
      case 'started':
        return 'Rediger svar';
        break;
      case 'approval':
        return 'Se svar';
        break;
      default:
        return 'Se spørsmål'
        break;
    }
  }

  return (
    <div className="question--list">
      {questionList.map(
        ({ id, subject, questionDate, studentGrade, themes }, index) => (
          <div key={index} className="question--list-item">
            <h4>{subject}</h4>
            <p>Klasse: {studentGradeFormat(studentGrade)}</p>
            <p>Sendt inn: {dateStringFormat(questionDate)}</p>
            <div className="question--list-themes">
              {themes.map(({ theme }) => (
                <div className="leksehjelp--tag question--list-themes-element">
                  <p>{theme}</p>
                </div >
              ))}
            </div>
            < div className="question--list-button-container">
              <button
                className="leksehjelp--button-success"
                onClick={() => history.push(`questions/${id}/${type}`)}
              >
                {' '}
                {getButtonText(type)}
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default withRouter(QuestionListComponent);
