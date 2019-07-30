import React from 'react';
import Routes from './router';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

import './styles/base';
import { SocketProvider } from './providers';

const App = () => {
  const authenticatedFunction = logout => {
    return (
      <ModalProvider>
        <SocketProvider>
          <Routes onLogout={logout} />
        </SocketProvider>
      </ModalProvider>
    );
  };
  const { origin } = window.location;

  return (
    <AzureAD
      provider={
        new MsalAuthProviderFactory(
          {
            auth: {
              authority: process.env.AUTHORITY,
              clientId: process.env.AAD_APP_CLIENT_ID || '',
              redirectUri: origin,
              postLogoutRedirectUri: origin,
            },
            cache: {
              cacheLocation: 'sessionStorage',
              storeAuthStateInCookie: true,
            },
          },
          {
            scopes: ['openid'],
          },
          LoginType.Redirect,
        )
      }
      forceLogin={true}
      authenticatedFunction={authenticatedFunction}
    />
  );
};

export default App;
