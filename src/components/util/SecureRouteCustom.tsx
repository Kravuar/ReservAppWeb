import { useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { toRelativeUrl } from "@okta/okta-auth-js";
import { Outlet } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export function RequiredAuth() {
  const { oktaAuth, authState } = useOktaAuth();

  useEffect(() => {
    if (!authState) {
      return;
    }

    if (!authState?.isAuthenticated) {
      const originalUri = toRelativeUrl(
        window.location.href,
        window.location.origin
      );
      oktaAuth.setOriginalUri(originalUri);
      oktaAuth.signInWithRedirect();
    }
  }, [oktaAuth, authState, authState?.isAuthenticated]);

  if (!authState || !authState?.isAuthenticated)
    return <ErrorPage message={"Не авторизован"} />;

  return <Outlet />;
}
