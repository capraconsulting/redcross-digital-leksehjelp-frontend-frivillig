import React from 'react';
import Dropdown from 'react-dropdown';
import Cross from '../assets/Cross'
import { IVolunteerSubject } from '../interfaces'

interface IOptions {
  value: string;
  label: string;
}

interface IProps {
  optionList: IOptions[];
  selectedList: IVolunteerSubject[];
  addSubject(event, type: string): void;
  removeSubject(id: number, subject: string, type: string, event): void;
  title: string;
  type: string
}

const PickerComponent = ({title, optionList, addSubject, selectedList, removeSubject, type }: IProps) => (
  <div className="profile--component">
    <h3>{title}</h3>
    <Dropdown
      className="subject--dropdown"
      options={optionList}
      onChange={e => addSubject(e, type)}
      placeholder="Legg til fag"
    />
    <div className="subject--list">
      {selectedList.map(({ subject, id }, index) => (
        <div key={index} className="subject--list-element">
          <p>{subject}</p>
          <button
            className="leksehjelp--button-close"
            onClick={e => removeSubject(id, subject, type, e)}
          >
            <Cross color="#8b51c6" />
          </button>
        </div>
      ))}
    </div>
  </div>
)

export default PickerComponent
