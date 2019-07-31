import React, { createContext, useState, FunctionComponent } from 'react';

export const ModalContext = createContext({
  isOpen: false,
  setIsOpen(bool: boolean): void {},
});

export const ModalProvider: FunctionComponent = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <ModalContext.Provider
      value={{
    isOpen,
      setIsOpen,
  }}
>
  {children}
  </ModalContext.Provider>
);
};
