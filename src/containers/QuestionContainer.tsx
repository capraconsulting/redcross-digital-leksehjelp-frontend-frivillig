import React from 'react';
import { get } from '../services/api-service';

interface IQuestion {
  title: string;
  id: string;
  question: string;
}

interface IQuestionContainer {
  questions: IQuestion[];
}

class QuestionContainer extends React.Component<{}, IQuestionContainer> {
  state = {
    questions: [] as IQuestion[],
  };

  componentDidMount() {
    get('questions').then(res => {
      if ('data' in res) {
        this.setState({ questions: res.data });
      }
    });
  }

  render() {
    const { questions } = this.state;
    return (
      <div>
        <h1>Spørsmål</h1>
        {questions.length > 0 ? (
          <ul>
            {questions.map(({ title }, id) => (
              <li key={id}>{title}</li>
            ))}
          </ul>
        ) : (
          <p>Det er ingen nye spørsmål som kan besvares</p>
        )}
      </div>
    );
  }
}

export default QuestionContainer;
