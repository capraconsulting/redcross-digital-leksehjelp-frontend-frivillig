import React, { MouseEvent } from 'react';
import Dropdown, { Option } from 'react-dropdown';
import Cross from '../assets/Cross';
import { IVolunteerSubject } from '../interfaces';

interface IProps {
  optionList: Option[];
  selectedList: IVolunteerSubject[];
  addSubject(option: Option, type: string): void;
  removeSubject(
    id: number,
    subject: string,
    type: string,
    event: MouseEvent,
  ): void;
  title?: string;
  type: string;
  placeholder: string;
}

const PickerComponent = ({
  title,
  optionList,
  addSubject,
  selectedList,
  removeSubject,
  type,
  placeholder,
}: IProps) => (
    <div className="profile--component">
      <h3>{title}</h3>
      <Dropdown
        className="leksehjelp--dropdown"
        options={optionList}
        onChange={option => addSubject(option, type)}
        placeholder={placeholder}
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
  );

export default PickerComponent;
