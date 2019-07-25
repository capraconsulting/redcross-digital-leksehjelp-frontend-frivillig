import React, { createContext, useState } from 'react';

export const StateContext = createContext({
  activeState: false,
  setActiveState(state: boolean) {},
});

export const StateProvider = ({ children }: any) => {
  const [activeState, setActiveState] = useState<boolean>(false);

  return (
    <StateContext.Provider value={{ activeState, setActiveState }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
