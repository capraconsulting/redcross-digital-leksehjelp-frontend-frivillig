import React, { useState, useContext } from 'react';
import Routes from './router';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

import './styles/base';
import { SocketProvider } from './providers';
import { StateContext } from './StateProvider';

const App = () => {
  const [accountInfo, setAccountInfo] = useState<any>(null);

  const accountInfoCallback = info => {
    setAccountInfo({ info });
  };

  const authenticatedFunction = logout => {
    return (
      <SocketProvider>
        <Routes onLogout={logout}/>
      </SocketProvider>
    )
  }
  const { AUTHORITY, AAD_APP_CLIENT_ID } = process.env;
  const { origin } = window.location;
  return (
    <div>
      <AzureAD
        provider={
          new MsalAuthProviderFactory(
            {
              auth: {
                authority: AUTHORITY,
                clientId: AAD_APP_CLIENT_ID || '',
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
        accountInfoCallback={accountInfoCallback}
        authenticatedFunction={authenticatedFunction}
      />
    </div>
  );
};

export default App;
