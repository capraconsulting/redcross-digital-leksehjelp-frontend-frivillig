import React, { FunctionComponent, useContext } from 'react';
import { SocketContext } from '../providers';

interface IProps {
  title: string;
  isChanged(value: boolean): void;
}

const ProfileFormContainer: FunctionComponent<IProps> = ({
  isChanged,
  title,
}) => {
  const { setVolunteerInfo: setProfile, volunteerInfo: profile } = useContext(
    SocketContext,
  );

  return (
    <div className="profile-form--container">
      <h3>{title}</h3>
      <form className="profile-form">
        <label className="profile-form--item">
          Navn
          <input
            className="profile-form--input"
            value={profile.name}
            type="text"
            name="name"
            onChange={e => {
              isChanged(true);
              setProfile({ ...profile, name: e.target.value });
            }}
          />
        </label>
        <label className="profile-form--item">
          E-post
          <input
            className="profile-form--input"
            value={profile.email}
            type="email"
            name="email"
            onChange={e => {
              isChanged(true);
              setProfile({ ...profile, email: e.target.value });
            }}
          />
        </label>
        <label className="profile-form--item">
          Bio
          <textarea
            className="profile-form--long-input"
            value={profile.bioText}
            name="bio"
            onChange={e => {
              isChanged(true);
              setProfile({ ...profile, bioText: e.target.value });
            }}
          />
        </label>
      </form>
    </div>
  );
};

export default ProfileFormContainer;
