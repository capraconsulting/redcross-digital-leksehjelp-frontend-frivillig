import React, { useState } from 'react';
import { ISubject } from '../interfaces';
import '../styles/admin-subjects.less';
import EditSubjectComponent from './EditSubjectComponent';

interface IProps {
  isLeksehjelp: boolean;
  subjects: ISubject[];
  onAddSubject: (subjectTitle: string, isMestring: number) => void;
  onRemoveSubject: (id: number, isMestring: number) => void;
  onAddTheme: (title: string, subjectId: number, isMestring: number) => void;
  onRemoveTheme: (themeId: string, isMestring: number) => void;
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

      {subjects.map(s => (
        <EditSubjectComponent
          key={s.id}
          subject={s}
          isMestring={!isLeksehjelp ? 1 : 0}
          onRemoveSubject={onRemoveSubject}
          onRemoveTheme={onRemoveTheme}
          onAddTheme={onAddTheme}
        />
      ))}

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
            onClick={() => {
              setNewSubject('');
              return onAddSubject(newSubject, isLeksehjelp ? 0 : 1);
            }}
            className={
              !newSubject
                ? 'leksehjelp--button-disabled'
                : 'leksehjelp--button-success'
            }
            type="button"
            disabled={!newSubject}
          >
            Legg til
          </button>
        </span>
      </div>
    </div>
  );
};

export default AdminSubjectsComponent;
