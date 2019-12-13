import React, { useContext, useState } from 'react';
import { StateContext } from '../providers';
import '../styles/admin-information.less';

interface IProps {
  id: string;
  text: string;
}
const OpeningDayRow = ({ id, text }: IProps) => {
  const { information, setInformation } = useContext(StateContext);
  const [startTime, setStartTime] = useState(information[id].start);
  const [endTime, setEndTime] = useState(information[id].end);

  const handleUpdatedCheckbox = e => {
    setInformation({
      ...information,
      [id]: {
        ...information[id],
        enabled: e.target.checked,
      },
      other: {
        ...information.other,
        enabled: false,
      },
    });
  };

  const handleUpdatedTimeInformation = e => {
    setInformation({
      ...information,
      [id]: {
        ...information[id],
        start: startTime,
        end: endTime,
      },
    });
  };

  return (
    <div
      className={
        information.other.enabled
          ? 'opening-day-container closed'
          : 'opening-day-container'
      }
    >
      <div>
        <input
          id={id}
          type="checkbox"
          onChange={handleUpdatedCheckbox}
          checked={information[id].enabled}
        />
        {text}
      </div>
      <div className="input-admin-time">
        <input
          className={information.other.enabled ? 'closed' : ''}
          id={id}
          type="time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          onBlur={handleUpdatedTimeInformation}
        />
        -
        <input
          className={information.other.enabled ? 'closed' : ''}
          id={id}
          type="time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          onBlur={handleUpdatedTimeInformation}
        />
      </div>
    </div>
  );
};

export default OpeningDayRow;
