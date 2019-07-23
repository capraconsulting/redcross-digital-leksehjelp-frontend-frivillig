import React, {useState, useContext} from 'react';
import Routes from './router';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

import './styles/base';
import { SocketProvider } from './providers';
import { StateContext } from './StateProvider';

const App = () => {
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const { loggedInState } = useContext(StateContext);

  const accountInfoCallback = info => {
    setAccountInfo({ info });
  };

  const authenticatedFunction = logout => {
    console.log("AUTH")
    if (loggedInState && accountInfo) {
      console.log("AUTH")
      logout();
      return logout;
    } return false;
  };

  return (
    <div>
    <AzureAD
      provider={
        new MsalAuthProviderFactory(
          {
            auth: {
              authority: process.env.REACT_APP_AUTHORITY || '',
              clientId: process.env.REACT_APP_AAD_APP_CLIENT_ID || '',
              redirectUri: window.location.origin,
              postLogoutRedirectUri: window.location.origin,
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
    {accountInfo &&
      <SocketProvider>
        <Routes />
      </SocketProvider>
    }
  </div>
  );
}

export default App;
