import React, { useContext, useState } from 'react';
import {
  openingHourDays,
  updateAnnouncement,
  updateOpeningHours,
} from '../services';
import { StateContext } from '../providers';
import OpeningDayRow from '../components/OpeningDayRow';
import '../styles/admin-information.less';

const AdminInformationContainer = () => {
  const { information, setInformation } = useContext(StateContext);
  const [updatedAnnouncement, setUpdatedAnnouncement] = useState('');

  const handleUpdateInformation = e => {
    setUpdatedAnnouncement(e.target.value);
    setInformation({
      ...information,
      announcement: updatedAnnouncement,
    });
  };

  const handleUpdateInformationClick = () => {
    setUpdatedAnnouncement('');
    (async () => {
      const success = updateAnnouncement(information.announcement);
      if (success) {
        console.log('Success, posted data:', information);
      }
    })();
  };

  const handleUpdateOtherOpeningHours = e => {
    setInformation({
      ...information,
      other: {
        ...information.other,
        enabled: e.target.checked,
      },
    });
  };

  const handleUpdateOpeningHours = () => {
    (async () => {
      const success = updateOpeningHours(information);
      if (success) {
        console.log('Success, posted data from:', information);
      }
    })();
  };

  return (
    <div className="side-margin">
      <div className="info-message">
        <h4>Info</h4>
        <p>
          Her kan du skrive en beskjed som vises på forsiden av Digital
          Leksehjelp
        </p>

        <textarea
          className="announcement-input"
          value={updatedAnnouncement}
          name="information"
          placeholder={information.announcement}
          onChange={e => handleUpdateInformation(e)}
        />
        <button
          className={
            updatedAnnouncement
              ? 'leksehjelp--button-success admin-update'
              : 'leksehjelp-button-disabled admin-update'
          }
          onClick={handleUpdateInformationClick}
          disabled={!updatedAnnouncement}
        >
          Oppdater
        </button>
      </div>
      <div className="opening-hours">
        <h4>Åpningstider</h4>
        Her kan du endre åpningstidene som blir vist på forside av digital
        leksehjelp.
        {Object.entries(openingHourDays).map(([id, text]) => (
          <OpeningDayRow key={id} id={id} text={text} />
        ))}
        <div className="opening-hours-other-container">
          <div className="opening-hours-other">
            <input
              type="checkbox"
              checked={information.other.enabled}
              onChange={handleUpdateOtherOpeningHours}
            />
            Annen melding{' '}
          </div>
          <textarea
            className="other-message"
            placeholder={information.other.message}
          />
        </div>
        <button
          className="leksehjelp--button-success admin-update"
          onClick={handleUpdateOpeningHours}
        >
          Oppdater
        </button>
      </div>
    </div>
  );
};

export default AdminInformationContainer;
