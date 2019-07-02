import React from 'react';
import Routes from './router';
import { StateProvider } from './StateProvider';

import './styles/base';

interface IState {
  active: boolean;
}

const App = () => {
  return (
    <StateProvider>
      <Routes />
    </StateProvider>
  );
};

export default App;
