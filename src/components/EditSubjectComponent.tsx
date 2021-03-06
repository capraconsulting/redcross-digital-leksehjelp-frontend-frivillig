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
  const [visible, setVisible] = useState(false);

  return (
    <div className="edit-subject-container">
      <div className="editable-subject" onClick={() => setVisible(!visible)}>
        <p>{subject.subjectTitle}</p>
        <div>
          <button
            className="leksehjelp--button--outline-warning-small"
            onClick={() => onRemoveSubject(subject.id, isMestring)}
          >
            Slett
          </button>
          <img
            src={
              visible
                ? require('../assets/images/close.svg')
                : require('../assets/images/open.svg')
            }
          />
        </div>
      </div>
      <div className={visible ? 'themes-container' : 'themes-container-hidden'}>
        <p className="themes-title">Undertema</p>
        <div className="edit-themes">
          {subject.themes.map(t => (
            <div key={t.id} className="subject--list-element">
              <p>{t.theme}</p>
              <button
                className="leksehjelp--button-close"
                onClick={() => onRemoveTheme(t.id, isMestring)}
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
