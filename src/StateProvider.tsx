import React, { createContext, useState } from 'react';

export const StateContext = createContext({
  activeState: false,
  loggedInState: false,
  setLoggedInState(state: boolean) {},
  setActiveState(state: boolean) {},
});

export const StateProvider = ({ children }: any) => {
  const [activeState, setActiveState] = useState<boolean>(false);
  const [loggedInState, setLoggedInState] = useState<boolean>(false);

  return (
    <StateContext.Provider value={{ activeState, setActiveState, loggedInState, setLoggedInState }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
