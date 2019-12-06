import React, { useState } from 'react';
import { ISubject } from '../interfaces';
import '../styles/admin-subjects.less';
import CollapsableComponent from './CollapsableComponent';

interface IProps {
  isLeksehjelp: boolean;
  subjects: ISubject[];
  onAddSubject: (subject: ISubject) => void;
  onRemoveSubject: (id: number) => void;
  onAddTheme: (title: string, subjectId: number) => void;
  onRemoveTheme: (themeId: string, subject: ISubject) => void;
}

const AdminSubjectsComponent = ({
  isLeksehjelp,
  subjects,
  onAddSubject,
  onRemoveSubject,
  onAddTheme,
  onRemoveTheme,
}: IProps) => {
  const [newSubject, setNewSubject] = useState('');
  return (
    <div className="admin-subjects--item">
      <h3 className="admin-subjects--header">
        {isLeksehjelp ? 'Leksehjelp' : 'Mestring og motivasjon'}
      </h3>
      <div>
        {subjects.map(s => (
          <CollapsableComponent
            key={s.id}
            subject={s}
            onRemoveSubject={onRemoveSubject}
            onRemoveTheme={onRemoveTheme}
            onAddTheme={onAddTheme}
          />
        ))}
      </div>
      <div className="admin-subjects--new">
        <h4>Legg til fag</h4>
        <span>
          <input
            value={newSubject}
            onChange={event => setNewSubject(event.target.value)}
            type="text"
            placeholder="Skriv inn nytt fag"
          />{' '}
          <button
            onClick={() =>
              onAddSubject({
                subjectTitle: newSubject,
                id: 100,
                themes: [],
              })
            }
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

export default AdminSubjectsComponent;
