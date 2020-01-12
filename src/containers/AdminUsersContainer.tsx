import React, { useCallback, useEffect, useState } from 'react';
import AddUserComponent from '../components/AddUserComponent';
import EditUsersComponent from '../components/EditUsersComponent';
import { addUser, deleteUser, getUserList, updateUserRole } from '../services';
import '../styles/admin-users.less';
import { toast } from 'react-toastify';
import { INewUser } from '../interfaces/INewUser';
import { IVolunteer } from '../interfaces';

const AdminUsersContainer = () => {
  const [users, setUsers] = useState<IVolunteer[]>([]);

  const refreshUsers = useCallback(() => {
    getUserList().then(setUsers);
  }, [setUsers]);

  useEffect(refreshUsers, []);

  const handleUpdateUserRole = useCallback(
    async (id: string, role: string) => {
      await updateUserRole(id, role);
      refreshUsers();
    },
    [refreshUsers],
  );

  const handleAddUser = useCallback(
    async (user: INewUser) => {
      try {
        await addUser(user);
        refreshUsers();
        toast.success(
          `${user.name} har blitt lagt til som bruker med rollen ${user.role}.`,
        );
      } catch (error) {
        toast.error(
          'Brukeren kan ikke legges til. Vennligst kontakt IT-avdelingen.',
        );
      }
    },
    [refreshUsers],
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      await deleteUser(id);
      refreshUsers();
    },
    [refreshUsers],
  );

  return (
    <div className="admin-users-container">
      <AddUserComponent onAddUser={handleAddUser} />
      <EditUsersComponent
        users={users}
        onUpdateUser={handleUpdateUserRole}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default AdminUsersContainer;
