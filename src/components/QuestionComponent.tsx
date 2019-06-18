import React from 'react';
import { IQuestion } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';

interface IProps {
  questionObj: IQuestion;
}
const QuestionComponent = (props: IProps & RouteComponentProps) => {
  const { question, id } = props.questionObj;

  return (
    <div
      onClick={() => props.history.push(`questions/${id}`)}
      className="question--list-item"
    >
      {question}
    </div>
  );
};

export default withRouter(QuestionComponent);
