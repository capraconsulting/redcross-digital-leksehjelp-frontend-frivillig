import React, { Component } from 'react';
import { get } from '../services/api-service';
import { QuestionComponent } from '../components';
import { IQuestion } from '../interfaces/IQuestion';

interface IQuestionContainer {
  answeredQuestions: IQuestion[];
  unansweredQuestions: IQuestion[];
}

class QuestionContainer extends Component<{}, IQuestionContainer> {
  state = {
    answeredQuestions: [] as IQuestion[],
    unansweredQuestions: [] as IQuestion[],
  };

  componentDidMount() {
    get('questions?answered=true').then(res => {
      this.setState({ answeredQuestions: res });
    });
    get('questions?answered=false').then(res => {
      this.setState({ unansweredQuestions: res });
    });
  }

  render() {
    const { answeredQuestions, unansweredQuestions } = this.state;
    return (
      <div>
        <div className="question--header">
          <h3>Spørsmål</h3>
        </div>
        <h3>Spørsmål som kan besvares</h3>
        {answeredQuestions.length > 0 ? (
          <div className="question--list">
            {answeredQuestions.map(({ question }, id) => (
              <QuestionComponent key={id} question={question} />
            ))}
          </div>
        ) : (
          <p>Det er ingen nye spørsmål som kan besvares</p>
        )}
        <h3>Besvarte spørsmål</h3>
        {unansweredQuestions.length > 0 ? (
          <div className="question--list">
            {unansweredQuestions.map(({ question }, id) => (
              <QuestionComponent key={id} question={question} />
            ))}
          </div>
        ) : (
          <p>Det finnes ingen spørsmål som er besvart</p>
        )}
      </div>
    );
  }
}

export default QuestionContainer;
