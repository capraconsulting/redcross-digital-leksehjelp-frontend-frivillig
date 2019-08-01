import React from 'react';
import { IQuestion } from '../interfaces';
import PickerComponent from './PickerComponent';

interface IProps {
  question: IQuestion;
  setQuestion(question: IQuestion): void;
  onApprove(): void;
  onDisapprove(): void;
  onSend(event): void;
  onSave(event): void;
  type: string;
}

const QuestionFromContainer = ({
  question,
  setQuestion,
  onApprove,
  onDisapprove,
  onSave,
  onSend,
  type,
}: IProps) => {
  const { title, questionText, answerText } = question;
  return (
    <div className="question-answer--container">
      <h3>Spørsmål og svar</h3>
      <form className="question-form">
        <label className="question-form--item">
          Tittel
          <input
            className="question-form--input"
            value={title}
            type="text"
            name="title"
            onChange={e => setQuestion({ ...question, title: e.target.value })}
          />
        </label>
        <label className="question-form--item">
          Spørsmål
          <textarea
            className="question-form--question"
            value={questionText}
            name="question"
            onChange={e =>
              setQuestion({ ...question, questionText: e.target.value })
            }
          />
        </label>
        <label className="question-form--item">
          Svar
          <textarea
            className="question-form--answer"
            value={answerText}
            name="answer"
            onChange={e =>
              setQuestion({ ...question, answerText: e.target.value })
            }
          />
        </label>
      </form>
      {type === 'approval' ? (
        <div className="question-form--button-container">
          <button className="leksehjelp--button-success" onClick={onApprove}>
            Godkjenn
          </button>
          <button className="leksehjelp--button-warning" onClick={onDisapprove}>
            Ikke godkjenn
          </button>
        </div>
      ) : (
        <div className="question-form--button-container">
          <button className="leksehjelp--button-success" onClick={onSend}>
            Send til godkjenning
          </button>
          <button className="leksehjelp--button-success" onClick={onSave}>
            Lagre
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionFromContainer;
