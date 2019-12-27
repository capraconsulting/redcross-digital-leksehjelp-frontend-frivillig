import React, { createContext, useEffect, useState } from 'react';
import { getIsLeksehjelpOpen } from '../services';

export const StateContext = createContext({
  activeState: false,
  setActiveState(state: boolean) {},
  isLeksehjelpOpen: false,
  setIsLeksehjelpOpen(bool: boolean): void {},
});

export const StateProvider: React.FC = ({ children }) => {
  const [activeState, setActiveState] = useState<boolean>(false);
  const [isLeksehjelpOpen, setIsLeksehjelpOpen] = useState<boolean>(false);

  useEffect(() => {
    getIsLeksehjelpOpen().then(data => setIsLeksehjelpOpen(data.isopen));
  }, []);

  return (
    <StateContext.Provider
      value={{
        activeState,
        setActiveState,
        isLeksehjelpOpen,
        setIsLeksehjelpOpen,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
