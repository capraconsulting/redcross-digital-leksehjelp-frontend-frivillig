import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import '../styles/admin-users.less';
import { getRoleOptions } from '../services';
import { IVolunteer } from '../interfaces';

interface IProps {
  user: IVolunteer;
  onUpdateUser: (id: string, role: string) => void;
  onDeleteUser: (id: string) => void;
}
const EditUserRow: React.FC<IProps> = ({
  user,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [role, setRole] = useState(user.role);

  const handleUpdatedUser = option => {
    setRole(option.value);
    onUpdateUser(user.id, option.value);
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.subjects}</td>
      <td>
        <Dropdown
          value={role}
          className="leksehjelp--dropdown"
          options={getRoleOptions()}
          onChange={option => handleUpdatedUser(option)}
          placeholder={role}
        />
      </td>
      <td>
        <button
          className="leksehjelp--button--outline-warning w60"
          onClick={() => onDeleteUser(user.id)}
        >
          Slett
        </button>
      </td>
    </tr>
  );
};

export default EditUserRow;
