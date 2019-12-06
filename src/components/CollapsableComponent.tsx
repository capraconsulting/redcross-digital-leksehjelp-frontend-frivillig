import React, { useState } from 'react';
import { ISubject } from '../interfaces';
import '../styles/collapsable-component.less';
import Cross from '../assets/Cross';

interface IProps {
  subject: ISubject;
  onRemoveSubject: (id: number) => void;
  onRemoveTheme: (id: string, subject: ISubject) => void;
  onAddTheme: (title: string, subjectId: number) => void;
}

const CollapsableComponent = ({
  subject,
  onRemoveSubject,
  onRemoveTheme,
  onAddTheme,
}: IProps) => {
  const [newTheme, setNewTheme] = useState('');

  return (
    <div className="collapsable">
      <div className="editable-subject">
        <h4>{subject.subjectTitle}</h4>
        <button
          className="leksehjelp--button--outline-warning-small"
          onClick={() => onRemoveSubject(subject.id)}
        >
          Slett
        </button>
      </div>
      <p>Undertema</p>
      <div className="admin-themes">
        {subject.themes.map(t => (
          <div key={t.id} className="subject--list-element">
            <p>{t.theme}</p>
            <button
              className="leksehjelp--button-close"
              onClick={e => onRemoveTheme(t.id, subject)}
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
            onClick={() => onAddTheme(newTheme, subject.id)}
            className="leksehjelp--button-success"
            type="button"
          >
            Legg til
          </button>
        </span>
      </div>
    </div>
  );
};

export default CollapsableComponent;
