import React from 'react';
import Routes from './router';

import './styles/base';
import 'react-toastify/dist/ReactToastify.min.css';
import { SocketProvider, ModalProvider } from './providers';

const App = () => (
  <SocketProvider>
    <ModalProvider>
      <Routes />
    </ModalProvider>
  </SocketProvider>
);

export default App;
