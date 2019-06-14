import React from 'react';
import { get } from '../services/api-service';

const renderQuestionList = (): any => {
  get('questions').then(res => {
    console.log(res);
    if ('data' in res) {
      return res.data.map(question => <div>question.title</div>);
    }
    return <h1>Det er ingen nye spørsmål å besvare</h1>;
  });
};

const QuestionContainer = () => (
  <div>
    <h1>Spørsmål</h1>
    {renderQuestionList()}
  </div>
);

export default QuestionContainer;

/*

*/
