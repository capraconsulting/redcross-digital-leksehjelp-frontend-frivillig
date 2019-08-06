import React, { useState, MouseEvent, useEffect } from 'react';
import Dropdown, { Option } from 'react-dropdown';
import { IQuestion, ITheme } from '../interfaces';
import Cross from '../assets/Cross';

interface IProps {
  question: IQuestion;
  setQuestion(question: IQuestion): void;
  onApprove(): void;
  onDisapprove(): void;
  onSend(event): void;
  onSave(event): void;
  type: string;
  themeList: ITheme[];
}

const QuestionFormComponent = ({
  question,
  setQuestion,
  onApprove,
  onDisapprove,
  onSave,
  onSend,
  type,
  themeList,
}: IProps) => {
  const { title, questionText, answerText, themes } = question;
  const options = themeList.map(e => ({ value: e.id, label: e.theme }));
  const [chosenThemes, setChosenThemes] = useState<Option[]>([]);

  useEffect(() => {
    setChosenThemes(
      themes.map(({ id, theme }) => ({ value: id, label: theme })),
    );
  }, [question.themes]);

  useEffect(() => {
    type === 'inbox' &&
      setQuestion({
        ...question,
        answerText:
          'Hei, \n\n' +
          'Takk for at du bruker digital leksehjelp!\n\n\n\n' +
          'Med vennlig hilsen\n' +
          'Digital Leksehjelp',
      });
  }, []);

  const onAdd = ({ value, label }: Option) => {
    if (!(chosenThemes.filter(e => e.value === value).length > 0)) {
      setChosenThemes([...[{ value, label }], ...chosenThemes]);

      const theme = { theme: label as string, id: value.toString() };
      setQuestion({
        ...question,
        themes: [...themes.filter(e => e.id !== value.toString()), theme],
      });
    }
  };

  const onRemove = (item: string, e: MouseEvent): void => {
    setChosenThemes(chosenThemes.filter(e => e.value !== item));
    setQuestion({
      ...question,
      themes: themes.filter(e => e.id.toString() !== item.toString()),
    });
    e.preventDefault();
  };

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
          <Dropdown
            className="leksehjelp--dropdown"
            options={options}
            onChange={option => onAdd(option)}
            placeholder={'Velg tema'}
          />
        </label>
        <label className="question-form--item question-form--tagg">
          {chosenThemes.map(({ value, label }, index) => (
            <div key={index} className="subject--list-element">
              <p>{label}</p>
              <button
                className="leksehjelp--button-close"
                onClick={e => onRemove(value, e)}
              >
                <Cross color="#8b51c6" />
              </button>
            </div>
          ))}
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

export default QuestionFormComponent;
