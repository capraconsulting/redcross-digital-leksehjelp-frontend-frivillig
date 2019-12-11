import React, { useContext, useState } from 'react';
import { postLeksehjelpInformation } from '../services';
import { StateContext } from '../providers';

const AdminInformationContainer = () => {
  const { information, setInformation } = useContext(StateContext);
  const [updatedAnnouncement, setUpdatedAnnouncement] = useState('');

  const handleUpdateInformation = e => {
    setUpdatedAnnouncement(e.target.value);
    setInformation({
      ...information,
      announcement: updatedAnnouncement,
    });
    console.log('Information is: ' + information);
  };

  const handleUpdateInformationClick = () => {
    setUpdatedAnnouncement('');
    (async () => {
      const success = postLeksehjelpInformation(information);
      /*const success = postSpecificLeksehjelpInformation(
        information,
        'announcement',
      );*/
      if (success) {
        console.log('Success, posted data:', information);
      }
    })();
  };

  return (
    <div>
      <div className="info-message">
        <h4>Info</h4>
        <p>
          Her kan du skrive en beskjed som vises på forsiden av Digital Leksehjelp
        </p>

        <textarea
          className="profile-form--long-input"
          value={updatedAnnouncement}
          name="information"
          placeholder={information.announcement}
          onChange={e => handleUpdateInformation(e)}
        />
        <button
          className={
            updatedAnnouncement
              ? 'leksehjelp--button-success'
              : 'leksehjelp-button-disabled'
          }
          onClick={handleUpdateInformationClick}
          disabled={!updatedAnnouncement}
        >
          Oppdater
        </button>
      </div>
      <div className="opening-hours">
        <h4>Åpningstider</h4>
        Her kan du endre åpningstidene som blir vist på forside av digital leksehjelp.
      </div>
    </div>
  );
};

export default AdminInformationContainer;
