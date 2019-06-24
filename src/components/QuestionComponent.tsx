import React from 'react';
import { IQuestion } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';

interface IProps {
  questionList: IQuestion[];
}
const QuestionComponent = (props: IProps & RouteComponentProps) => {
  const { questionList } = props;

  if (questionList.length < 1) {
    return <p>Denne listen er tom for øyeblikket</p>;
  }

  return (
    <div className="question--list">
      {questionList.map((question, index) => (
        <div key={index} className="question--list-item">
          <h4>{question.course}</h4>
          <p>Klasse: {question.class}</p>
          <p>Sendt inn: 31.04.18 kl. 15:57</p>
          <div className="question--list-button">
            <button
              onClick={() => props.history.push(`questions/${question.id}`)}
            >
              {' '}
              Se spørsmål
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default withRouter(QuestionComponent);
