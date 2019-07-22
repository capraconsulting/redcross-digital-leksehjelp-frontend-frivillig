import React from 'react';
import Routes from './router';

import './styles/base';
import { SocketProvider } from './providers';

const App = () => (
  <SocketProvider>
    <Routes />
  </SocketProvider>
);

export default App;
