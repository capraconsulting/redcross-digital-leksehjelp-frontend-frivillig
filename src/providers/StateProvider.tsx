import React, { createContext, useEffect, useState } from 'react';
import { getLeksehjelpInformation } from '../services';
import { IOpeningHours } from '../interfaces/IOpeningHours';
import { IInformation } from '../interfaces/IInformation';

const defaultOpeningHours: IOpeningHours = {
  start: '17:00',
  end: '21:00',
  enabled: true,
};

const initialInformation: IInformation = {
  isOpen: false,
  announcement:
    'Hvis det tar lang tid å få videohjelp anbefaler vi å prøve vanlig chat i stedet. Det går ofte raskere!',
  monday: defaultOpeningHours,
  tuesday: defaultOpeningHours,
  wednesday: defaultOpeningHours,
  thursday: defaultOpeningHours,
  friday: defaultOpeningHours,
  saturday: defaultOpeningHours,
  sunday: defaultOpeningHours,
  other: {
    enabled: false,
    message: '',
  },
};

export const StateContext = createContext({
  activeState: false,
  setActiveState(state: boolean) {},
  information: initialInformation,
  setInformation(information: IInformation): void {},
});

export const StateProvider: React.FC = ({ children }) => {
  const [activeState, setActiveState] = useState<boolean>(false);
  const [information, setInformation] = useState(initialInformation);

  useEffect(() => {
    getLeksehjelpInformation().then(data =>
      setInformation(data || initialInformation),
    );
  }, []);

  return (
    <StateContext.Provider
      value={{
        activeState,
        setActiveState,
        information,
        setInformation,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
