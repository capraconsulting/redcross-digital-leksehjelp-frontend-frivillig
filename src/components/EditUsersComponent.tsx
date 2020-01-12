import React from 'react';
import EditUserRow from './EditUserRow';
import '../styles/admin-users.less';
import { IVolunteer } from '../interfaces';

interface IProps {
  users: IVolunteer[];
  onUpdateUser: (id: string, role: string) => void;
  onDeleteUser: (id: string) => void;
}

const EditUsersComponent: React.FC<IProps> = ({
  users,
  onUpdateUser,
  onDeleteUser,
}) => (
  <div className="edit-users">
    <h4 className="edit-users--title">Alle brukere</h4>
    <table cellPadding="10">
      <thead>
        <tr className="edit-users--row edit-users--header">
          <th>Navn</th>
          <th>Brukernavn</th>
          <th>Fag</th>
          <th>Rolle</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {users.length >= 1 &&
          users.map(user => (
            <EditUserRow
              key={user.id}
              user={user}
              onUpdateUser={onUpdateUser}
              onDeleteUser={onDeleteUser}
            />
          ))}
      </tbody>
    </table>
  </div>
);

export default EditUsersComponent;
