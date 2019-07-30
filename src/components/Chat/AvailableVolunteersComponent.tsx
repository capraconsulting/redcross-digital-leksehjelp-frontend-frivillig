import React from 'react';

interface IProps {
  availableVolunteers: string[];
  closePopup(): any;
}

const AvailableVolunteersComponent = (props: IProps) => {
  const selectUser = name => {
    console.log(name);
  };

  const mapAvailable = () =>
    props.availableVolunteers.map(name => (
      <div key={name}>
        <p>{name}</p>
        <button onClick={() => selectUser(name)}>Select</button>
      </div>
    ));

  return <div>{mapAvailable()}</div>;
};

export default AvailableVolunteersComponent;
