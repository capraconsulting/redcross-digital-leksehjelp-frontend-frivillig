import React from 'react';
import Routes from './router';

import './styles/base';
import 'react-toastify/dist/ReactToastify.min.css';
import { SocketProvider } from './providers';

const App = () => (
  <SocketProvider>
    <Routes />
  </SocketProvider>
);

export default App;
