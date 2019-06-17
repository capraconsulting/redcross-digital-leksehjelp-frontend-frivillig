import React from 'react';
import { get } from '../services/api-service';
import { QuestionComponent } from '../components';
import { IQuestion } from '../interfaces/IQuestion';

interface IQuestionContainer {
  questions: IQuestion[];
}

class QuestionContainer extends React.Component<{}, IQuestionContainer> {
  state = {
    questions: [] as IQuestion[],
  };

  componentDidMount() {
    get('questions').then(res => {
      this.setState({ questions: res });
    });
  }

  render() {
    const { questions } = this.state;
    return (
      <div>
        <h3>Spørsmål</h3>
        {questions.length > 0 ? (
          <div className="question--list">
            {questions
              .filter(({ answer }) => answer.length > 1)
              .map(({ question }, id) => (
                <QuestionComponent key={id} question={question} />
              ))}
          </div>
        ) : (
          <p>Det er ingen nye spørsmål som kan besvares</p>
        )}
      </div>
    );
  }
}

export default QuestionContainer;
