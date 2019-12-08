import React, { useState } from 'react';
import { ISubject } from '../interfaces';
import '../styles/admin-subjects.less';
import Cross from '../assets/Cross';

interface IProps {
  subject: ISubject;
  isMestring: number;
  onRemoveSubject: (id: number, isMestring: number) => void;
  onRemoveTheme: (id: string, isMestring: number) => void;
  onAddTheme: (title: string, subjectId: number, isMestring: number) => void;
}

const EditSubjectComponent = ({
  subject,
  isMestring,
  onRemoveSubject,
  onRemoveTheme,
  onAddTheme,
}: IProps) => {
  const [newTheme, setNewTheme] = useState('');

  return (
    <div className="edit-subject-container">
      <div className="editable-subject">
        <p>{subject.subjectTitle}</p>
        <button
          className="leksehjelp--button--outline-warning-small"
          onClick={() => onRemoveSubject(subject.id, isMestring)}
        >
          Slett
        </button>
      </div>
      <div className="themes-container">
        <p>Undertema</p>
        <div className="edit-themes">
          {subject.themes.map(t => (
            <div key={t.id} className="subject--list-element">
              <p>{t.theme}</p>
              <button
                className="leksehjelp--button-close"
                onClick={() => onRemoveTheme(t.id, isMestring)}
                disabled={!newTheme}
              >
                <Cross color="#8b51c6" />
              </button>
            </div>
          ))}
        </div>
        <div>
          <span>
            <input
              value={newTheme}
              onChange={event => setNewTheme(event.target.value)}
              type="text"
              placeholder="Legg til nytt undertema"
            />{' '}
            <button
              onClick={() => {
                setNewTheme('');
                return onAddTheme(newTheme, subject.id, isMestring);
              }}
              className={
                !newTheme
                  ? 'leksehjelp--button-disabled'
                  : 'leksehjelp--button-success'
              }
              type="button"
              disabled={newTheme.length === 0}
            >
              Legg til
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditSubjectComponent;
