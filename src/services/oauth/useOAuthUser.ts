import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { UserClaims, CustomUserClaims } from "@okta/okta-auth-js";

export default function useAuthUser() {
  const { oktaAuth, authState } = useOktaAuth();
  const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await oktaAuth.getUser();
        setUserInfo(res);
      } catch (error) {
        console.log(error);
      }
    };

    authState?.isAuthenticated && getUser();
  }, [authState, oktaAuth]);

  return userInfo;
};