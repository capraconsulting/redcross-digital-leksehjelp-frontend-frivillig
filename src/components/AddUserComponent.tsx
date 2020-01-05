import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import { VolunteerRole } from '../enums/VolunteerRole';
import { getRoleOptions } from '../services';
import { INewUser } from '../interfaces/INewUser';

interface IProps {
  onAddUser: (user: INewUser) => void;
}

const AddUserComponent = ({ onAddUser }: IProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<VolunteerRole | undefined>(undefined);

  const clearUserFields = () => {
    setName('');
    setEmail('');
    setRole(undefined);
  };

  const isValidEmail = (email: string) => {
    return /.+@.+/.test(email);
  };

  const isValidForm = name.length > 1 && role && isValidEmail(email);

  return (
    <div className="add-users">
      <h4 className="add-users--title">Legg til ny bruker</h4>
      <div className="add-users--fields">
        <input
          className="profile-form--input add-users--item"
          value={name}
          name="name"
          placeholder="Navn"
          onChange={e => {
            setName(e.target.value);
          }}
        />
        <input
          className="profile-form--input add-users--item"
          value={email}
          name="email"
          placeholder="Epost"
          onChange={e => {
            setEmail(e.target.value);
          }}
        />
        <div className="add-users--item">
          <Dropdown
            value={role}
            className="leksehjelp--dropdown"
            options={getRoleOptions()}
            onChange={option => setRole(option.value as VolunteerRole)}
            placeholder="Velg rolle"
          />
        </div>
      </div>
      <button
        className={
          isValidForm
            ? 'leksehjelp--button-success add-users--button'
            : 'leksehjelp--button-disabled add-users--button'
        }
        disabled={!isValidForm}
        onClick={() => {
          clearUserFields();
          return role && onAddUser({ name, email, role });
        }}
      >
        Legg til
      </button>
    </div>
  );
};

export default AddUserComponent;
