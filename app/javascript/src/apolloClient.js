import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI,
});

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-CSRF-Token': csrfToken,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
