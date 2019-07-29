import React, { createContext, useState, FunctionComponent } from 'react';
import { SocketContext } from './SocketProvider';

export const ModalContext = createContext({
  isOpen: boolean,
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
