import React from 'react';

interface IProps {
  question: string;
}

const QuestionComponent = ({ question }: IProps) => (
  <div className="question--list-item">{question}</div>
);

export default QuestionComponent;
