import { Route, BrowserRouter, Routes } from "react-router-dom";
import { LoginCallback, Security } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import AppContainer from "./components/layout/AppContainer";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CALLBACK_PATH = process.env.REACT_APP_CALLBACK_PATH;
const ISSUER = process.env.REACT_APP_ISSUER;
const REDIRECT_URI = `${window.location.origin}${CALLBACK_PATH}`;
const SCOPES = process.env.REACT_APP_SCOPES;

if (!SCOPES || !CLIENT_ID || !CALLBACK_PATH || !ISSUER) {
  throw new Error("All environmental variables must be set");
}

const config = {
  issuer: ISSUER,
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  scopes: SCOPES.split(/\s+/),
};

const oktaAuth = new OktaAuth(config);

const App = () => {
  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string
  ) => {
    window.location.replace(
      toRelativeUrl(originalUri || "/", window.location.origin)
    );
  };

  return (
    <BrowserRouter>
      <Security restoreOriginalUri={restoreOriginalUri} oktaAuth={oktaAuth}>
        <AppContainer />
        {/* System routes */}
        <Routes>
          <Route path={CALLBACK_PATH} element={<LoginCallback />} />
        </Routes>
      </Security>
    </BrowserRouter>
  );
};

export default App;
