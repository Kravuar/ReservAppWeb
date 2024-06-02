import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import OktaAuth from "@okta/okta-auth-js";

export const CALLBACK_PATH = process.env.REACT_APP_CALLBACK_PATH;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
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

export const oktaAuth = new OktaAuth(config);

const graphqlLink = new HttpLink({
  uri: process.env.REACT_APP_BACKEND + "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const authState = oktaAuth.authStateManager.getAuthState();
  const token = authState && authState.accessToken 
    ? authState.accessToken.accessToken
    : null;
  return {
    headers: {
      ...headers,
      ...(token && {authorization: `Bearer ${token}`})
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, graphqlLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }
});