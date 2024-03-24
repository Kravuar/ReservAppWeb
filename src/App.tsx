import { Route, BrowserRouter, Routes } from "react-router-dom";
import { LoginCallback, Security } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import AppContainer from "./components/layout/routes/AppContainer";
import { CALLBACK_PATH, oktaAuth } from "./services/network";

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
